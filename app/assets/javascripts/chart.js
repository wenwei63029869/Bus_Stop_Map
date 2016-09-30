var ChartModule = {
  createBarChart: function(data) {
    $('#myChart').replaceWith('<canvas id="myChart"></canvas>');
    var ctx = $("#myChart");
    ctx.empty();
    var dataset = this.constructDataset(data);
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: dataset
        // ,
        // options: options
    });
  },

  constructDataset: function(data) {
    var dataset = {
      labels: ["0-200", "200-400", "400-600", "600-800", "> 800"],
      datasets: [{
          label: "Current Area",
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1,
          data: data,
      }]
    };
    return dataset;
  }
};