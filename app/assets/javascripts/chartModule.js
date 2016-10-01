var chartModule = (function() {
  var data = Array(7).fill(0);

  return{
    updateData: function(boardingSum) {
      switch(true) {
        case (boardingSum > 0 && boardingSum <= 10) :
          data[0] += 1;
          break;
        case (boardingSum > 10 && boardingSum <= 50) :
          data[1] += 1;
          break;
        case (boardingSum > 50 && boardingSum <= 200) :
          data[2] += 1;
          break;
        case (boardingSum > 200 && boardingSum <= 400) :
          data[3] += 1;
          break;
        case (boardingSum > 400 && boardingSum <= 600) :
          data[4] += 1;
          break;
        case (boardingSum > 600 && boardingSum <= 800) :
          data[5] += 1;
          break;
        case (boardingSum > 800) :
          data[6] += 1;
          break;
      }
    },

    createBarChart: function() {
      $('#myChart').replaceWith('<canvas id="myChart"></canvas>');
      var ctx = $("#myChart");
      var dataset = this.constructDataset();
      var myBarChart = new Chart(ctx, {
          type: 'bar',
          data: dataset,
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });
      data = Array(7).fill(0);
    },

    constructDataset: function() {
      var dataset = {
        labels: ["0-10", "10-50", "50-200", "200-400", "400-600", "600-800", "> 800"],
        datasets: [{
            label: "Current Area",
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderWidth: 1,
            data: data,
        }]
      };
      return dataset;
    }
  };
}());