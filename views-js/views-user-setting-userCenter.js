$(document).ready(() => {
    var myChart = null

    $('#setting-user-srot-nav li').click(function () {
        sortUserTable($(this).attr('sort'))
    })

    $('#setting-chart-nav li').click(function () {
        getChartData($(this).attr('category'))
    })

    getChartData('visit')

    function sortUserTable (sort) {
        $('#setting-user-srot-nav li').removeClass('active')
        $('#setting-user-srot-nav li[sort=' + sort + ']').addClass('active')

        $.get('/api/getAllUser?sort=' + sort)
        .then((result) => {
            //result = JSON.parse(result)
            //console.log(result)
            $('#setting-user-sort-table tbody').html('<tr><th></th><th>用户名</th><th>积分</th><th>文章数</th><th>评论数</th></tr>')

            result.forEach((user, index) => {
                var html = '<tr>' + 
                '<td>' + (index + 1) + '</td>' +
                '<td>' + user.name + '</td>' +
                '<td>' + user.score + '</td>' +
                '<td>' + user.articleCount + '</td>' +
                '<td>' + user.commentCount + '</td>' +
                '</tr>'

                $('#setting-user-sort-table tbody').append(html)
            })
        })
        .catch((err) => {
            console.log(err)
            $('#simple-prompt-modal .modal-body').text(err.responseText)
            $('#simple-prompt-modal').modal('show')
        })
    }

    function getChartData (category) {
        $('#setting-chart-nav li').removeClass('active')
        $('#setting-chart-nav li[category=' + category + ']').addClass('active')

        $.get('/api/getChartData?category=' + category)
        .then((result) => {
            //result = JSON.parse(result)
            generateChart(category, result)
        })
        .catch((err) => {
            console.log(err)
            $('#simple-prompt-modal .modal-body').text(err.responseText)
            $('#simple-prompt-modal').modal('show')
        })
    }

    function generateChart (category, data) {
        data.reverse()
        if (category == 'visit') { 
            var chartData = {labels: [], data: []}
            data.forEach((item) => {
                chartData.labels.push(item.date)
                chartData.data.push(item.visit)
            })
            generateLineChart(chartData)
        } else if (category == 'article') {
            var chartData = {labels: [], data: []}
            data.forEach((item) => {
                chartData.labels.push(item.date)
                chartData.data.push(item.count)
            })
            generateBarChart(chartData)
        } else if (category == 'comment') {
            var chartData = {labels: [], data: []}
            data.forEach((item) => {
                chartData.labels.push(item.date)
                chartData.data.push(item.count)
            })
            generateBarChart2(chartData)
        }
    }

    function generateBarChart (chartData) {
        var ctx = document.getElementById('activityChart').getContext('2d');

        if (myChart) {
            myChart.destroy()
            myChart = null
        }
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: '#近期文章发布量',
                    data: chartData.data,
                    backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(150, 255, 144, 0.2)'
                    ],
                    borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(150, 255, 144, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        })
    }

    function generateBarChart2 (chartData) {
        var ctx = document.getElementById('activityChart').getContext('2d');

        if (myChart) {
            myChart.destroy()
            myChart = null
        }
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: '#近期文章参与量',
                    data: chartData.data,
                    backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(150, 255, 144, 0.2)'
                    ],
                    borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(150, 255, 144, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        })
    }

    function generateLineChart (chartData) {
        var ctx = document.getElementById('activityChart').getContext('2d');

        if (myChart) {
            myChart.destroy()
            myChart = null
        }
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: '# 近期网站访问量',
                    data: chartData.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 0.8)',
                    borderWidth: 3
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        })
    }
})








