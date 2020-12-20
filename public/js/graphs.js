function generateSalesGraph() {
  var dataPoints = [];
  var chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Daily Sales Data',
    },
    axisY: {
      title: 'Quantity',
      titleFontSize: 24,
      includeZero: true,
    },
    axisX: {
      title: 'Name',
      titleFontSize: 24,
    },
    data: [
      {
        type: 'column',
        yValueFormatString: '#,### Units',
        dataPoints: dataPoints,
      },
    ],
  });
  function addData(data) {
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name);
      dataPoints.push({
        label: data[i].name,
        y: data[i].quantity,
      });
    }
    chart.render();
  }
  $.getJSON('http://localhost:3000/sellTransactionsJSON', addData);
}

function generateStoreGraph() {
  var dataPoints = [];
  var chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Store data',
    },
    axisY: {
      title: 'Quantity',
      titleFontSize: 24,
      includeZero: true,
    },
    axisX: {
      title: 'Name',
      titleFontSize: 24,
    },
    data: [
      {
        type: 'doughnut',
        yValueFormatString: '#,### Units',
        dataPoints: dataPoints,
      },
    ],
  });
  function addData(data) {
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name);
      dataPoints.push({
        label: data[i].name,
        y: data[i].quantity,
      });
    }
    chart.render();
  }
  $.getJSON('http://localhost:3000/storedatajson', addData);
}

function generateStoreGraph2() {
  var dataPoints = [];
  var chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Store data',
    },
    axisY: {
      title: 'Quantity',
      titleFontSize: 24,
      includeZero: true,
    },
    axisX: {
      title: 'Name',
      titleFontSize: 24,
    },
    data: [
      {
        type: 'column',
        yValueFormatString: '#,### Units',
        dataPoints: dataPoints,
      },
    ],
  });
  function addData(data) {
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].name);
      dataPoints.push({
        label: data[i].name,
        y: data[i].quantity,
      });
    }
    chart.render();
  }
  $.getJSON('http://localhost:3000/storedatajson', addData);
}
