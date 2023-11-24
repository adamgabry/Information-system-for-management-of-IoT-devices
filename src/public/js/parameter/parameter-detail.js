document.addEventListener('DOMContentLoaded', function () {
	let uri = window.location.pathname.split('/');
	const deviceId = uri.pop();
	const parameterId = uri.pop();
	loadParameterData(deviceId, parameterId);
	loadGraph(deviceId, parameterId);
	loadKpiList(deviceId, parameterId);
});

async function loadParameterData(deviceId, parameterId) {
	try {
		const parameterInfo = document.getElementById('parameterInfo');
		const response = await fetch(`/api/devices/${deviceId}/parameters/${parameterId}`);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const parameter = await response.json();

		console.log(parameter);

		parameterInfo.innerHTML = `
			<div class="row">
				<div class="col-12">
					<h3 class="text-center">Parameter Info</h3>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-12">
					<label for="parameterName" class="form-label">Name</label>
					<input type="text" id="parameterName" class="form-control" value="${parameter.name}" disabled>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-12">
					<label for="parameterUnits" class="form-label">Units</label>
					<textarea id="parameterUnits" class="form-control" disabled>${parameter.unit_name}</textarea>
				</div>
			</div>
			<div class="row mb-3">
				<div class="col-12">
					<label for="parameterType" class="form-label">Type</label>
					<input type="text" id="parameterType" class="form-control" value="${parameter.type_id}" disabled>
				</div>
			</div>
		`;


	} catch (error) {
		console.error('Failed to load devices:', error);
	}
}

async function loadGraph(deviceId, parameterId) {
	try {
		const response = await fetch(`/api/devices/${deviceId}/parameters/${parameterId}/data`);
		const data = await response.json();

		const unit_name = document.getElementById('parameterUnits').value;

		const labels = data.map(entry => entry.recorded_at);
		const values = data.map(entry => parseFloat(entry.parameter_value));

		const canvas = document.getElementById('dataChart');

		new Chart(canvas, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: `${unit_name}`,
					data: values,
					borderColor: 'rgba(75, 192, 192, 1)',
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'time',
						time: {
							parser: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
							unit: 'hour',
							displayFormats: {
								hour: 'H:mm'
							}
						}
					},
				}
			}
		});

	} catch (error) {
		console.error('Failed to load devices:', error);
	}
}

async function loadKpiList(deviceId, parameterId) {
	try {
		const response = await fetch(`/api/devices/${deviceId}/parameters/${parameterId}/kpis`);
		const kpis = await response.json();

		const kpiListElement = document.getElementById('kpiList');
		// Use Bootstrap's 'table' classes for styling
		kpiListElement.className = 'table table-striped table-bordered';
		kpiListElement.innerHTML = '<thead class="thead-dark"><tr><th>Threshold</th><th>Operation</th><th>Action</th></tr></thead><tbody>';

		kpis.forEach(kpi => {
			// Append rows to the table body
			const row = kpiListElement.insertRow();
			row.innerHTML = `
		  <td>${kpi.threshold}</td>
		  <td>${kpi.operation}</td>
		  <td><button class="btn btn-danger btn-sm delete-kpi" data-kpi-id="${kpi.id}">X</button></td>
		`;
		});

		// Add click event listeners to delete buttons
		document.querySelectorAll('.delete-kpi').forEach(button => {
			button.addEventListener('click', function (e) {
				const kpiId = e.target.getAttribute('data-kpi-id');
				deleteKpi(kpiId);
			});
		});

	} catch (error) {
		console.error('Failed to load KPIs:', error);
	}
}

async function deleteKpi(kpiId) {
	//TODO
	loadKpiList(deviceId, parameterId);
}

document.getElementById('createKpiForm').addEventListener('submit', function (e) {
	e.preventDefault();
	//TODO: Create KPI
	loadKpiList(deviceId, parameterId);
});