window.onload = function() {
    var populateCountryName = function() {
        d3.csv("../Population.csv", function(data) {
            var allCountryNames = data.map(function(country) {
                return '<option>' + country['Country Name'] + '</option>';
            }).join('<br>');
            var selectBox = document.querySelector('#countrySelect');
            selectBox.innerHTML = allCountryNames;
            selectBox.onchange = function(e) {
                renderCountryData(selectBox.value);
            }
        });
    }();

    var renderCountryData = function(countryName) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {}
        };
        xhttp.open("POST", "country", true);
        xhttp.send('country=' + countryName);
        d3.csv("/countryPopulation.csv", type, render);
    };
    var type = function(each) {
        each.year = +each.year;
        each.population = +each.population;
        return each;
    };
    var outerWidth = 900;
    var outerHeight = 600;
    var margin = {
        top: 30,
        down: 50,
        right: 30,
        left: 100
    };
    var innerWidth = outerWidth - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top - margin.down;

    var xColumn = 'year';
    var yColumn = 'population';

    var render = function(data) {
        var element = document.querySelector('div').innerHTML = '';
        var maxPopulation = d3.max(data, function(each) {
            return each[yColumn]
        });
        var minPopulation = d3.min(data, function(each) {
            return each[yColumn]
        });
        var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], 0.2);
        var yScale = d3.scale.linear().range([innerHeight, 0]);
        var colorScale = d3.scale.category10();

        xScale.domain(data.map(function(d) {
            return d['year']
        }));
        yScale.domain([minPopulation, maxPopulation]);
        var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
        var yAxis = d3.svg.axis().scale(yScale).orient('left');

        var svg = d3.select('div').append('svg')
            .attr('width', outerWidth)
            .attr('height', outerHeight)
        var outerG = svg.append('g').attr('transform', 'translate(0, 50)');

        outerG.append('g').attr('class', 'axis').attr('transform', 'translate(' + margin.left + ', ' + innerHeight + ')').call(xAxis);
        outerG.append('g').attr('class', 'axis').attr('transform', 'translate(' + margin.left + ',0)').call(yAxis);

        outerG.selectAll('rect').data(data).enter().append('rect')
            .attr('x', function(d) {
                return margin.left + xScale(d['year'])
            })
            .attr('y', function(d) {
                return yScale(d.population)
            })
            .attr('width', xScale.rangeBand())
            .attr('fill', function(d) {
                return colorScale(d.year)
            })
            .attr('height', function(d) {
                return innerHeight - yScale(d.population)
            });
    }
};