const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

var sampleData;
d3.json(url).then(function(data) {
    sampleData = data;
    // Making a list for the dropdown menu to select an ID
    var dropdown = document.getElementById("selDataset");
    for (var i = 0; i < sampleData.names.length; i++) {
      var option = document.createElement("option");
      option.text = sampleData.names[i];
      dropdown.add(option);
    }
  
    // set the default ID to 940 to match dropdown
    optionChanged("940");
  });
  
function optionChanged(selectedId) {
  console.log("Selected ID:", selectedId);

  // set up variables for the metadata
  var metadataArray = sampleData.metadata;
  var numericId = Number(selectedId);
  var metadata = metadataArray.find(function(item) {
    return item.id === numericId;
  });

  var metadataDiv = document.getElementById("sample-metadata");
  metadataDiv.innerHTML = "";

  // loop through the metadata object properties and display them in the metadataDiv
  for (var key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      var p = document.createElement("p");
      p.textContent = key + ": " + metadata[key];
      metadataDiv.appendChild(p);
    }
  }
  barGraph(selectedId);
  bubble(selectedId);
  gauge(selectedId);
}

// bar graph
function barGraph(selectedId) {
  var filteredData = sampleData.samples.filter(function(sample) {
    return sample.id === selectedId;
  });

  // Sort the filtered data by sample values in descending order
  var sortedData = filteredData[0].sample_values.slice().sort(function(a, b) {
    return b - a;
  });

  // Select the top 10 OTU IDs and sample values for the bar graph
  var topOtuIds = filteredData[0].otu_ids.slice(0, 10).reverse();
  var topSampleValues = filteredData[0].sample_values.slice(0, 10).reverse();

  // Create the trace for the bar graph
  var trace1 = {
    x: topSampleValues,
    y: topOtuIds.map(function(otuId) {
      return `OTU ${otuId}`;
    }),
    type: 'bar',
    orientation: 'h'
  };

  var data = [trace1];

  // Create the layout for the bar graph
  var layout = {
    title: 'Top 10 OTUs',
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU IDs' }
  };

  // Plot the bar graph
  Plotly.newPlot('bar', data, layout);
}

function bubble(selectedId) {
  var filteredData = sampleData.samples.filter(function(sample) {
    return sample.id === selectedId;
  });

// Create a trace for the bubble chart
  var trace1 = {
    x: filteredData[0].otu_ids,
    y: filteredData[0].sample_values,
    mode: 'markers',
    marker: {
      size: filteredData[0].sample_values,
      color: filteredData[0].otu_ids,
      colorscale: 'RdBu'
    },
    text: filteredData[0].otu_labels
  };

  var bubbleData = [trace1];

// Create the layout  for the bubble chart
  var layout = {
    title: 'Bubble Chart',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' }
  };

  Plotly.newPlot('bubble', bubbleData, layout);
}



function gauge(selectedId) {
    var numericId = Number(selectedId);
    var filteredData = sampleData.metadata.filter(function(metadata) {
      return metadata.id === numericId;
    });
    // Grab the wfrew for the gauge
    var value = filteredData[0].wfreq;
    // Create the trace for the gauge
    var gaugeTrace = {
        type: 'indicator',
        mode: 'gauge+number',
        value: value,
        gauge: {
          axis: { range: [0, 9] },
          bar: { color: 'rgba(123, 87, 51, 0.7)' },
        // Making a smooth transition for a dirty belly button to clean
          steps: [
            { range: [0, 1], color: 'rgba(123, 87, 51, 0.7)' },           
            { range: [1, 2], color: 'hsl(45, 70%, 45%)' },
            { range: [2, 3], color: 'hsl(60, 70%, 50%)' },
            { range: [3, 4], color: 'hsl(75, 70%, 55%)' },
            { range: [4, 5], color: 'hsl(90, 70%, 60%)' },
            { range: [5, 6], color: 'hsl(105, 70%, 65%)' },
            { range: [6, 7], color: 'hsl(120, 70%, 70%)' },
            { range: [7, 8], color: 'hsl(135, 70%, 75%)' },
            { range: [8, 9], color: 'hsl(150, 70%, 80%)' }
          ],
          threshold: {
            line: { color: 'red', width: 4 },
            thickness: 0.75,
            value: value
          },
          
        }
      };
  
      var gaugeData = [gaugeTrace];
    // Making a title for the gauge
      var gaugeLayout = {
        title: 'Belly Button Scrubs per Week',
        };
  
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  }