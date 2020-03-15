function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadatapanel = data.metadata;
    
    var results = metadatapanel.filter(sampleObj => sampleObj.id == sample);
    var final = results[0];
    
    var Display = d3.select("#sample-metadata");

    
    Display.html("");

    
    Object.entries(final).forEach(([key, value]) => {
      Display.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

   
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var results = samples.filter(sampleObj => sampleObj.id == sample);
    var final = results[0];


    var sample_values = final.sample_values;
    var otu_ids = final.otu_ids;
    var otu_labels = final.otu_labels;

 

    // Bubble Chart
    var Bubblechart = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var BubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Greens" 
        }
      }
    ];

    Plotly.newPlot("bubble", BubbleData, Bubblechart);

    var ytickmarks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var Bar= [
      {
        y: ytickmarks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var BarChart = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 40, l: 150 }
      
    };

    Plotly.newPlot("bar", Bar, BarChart);
  });
}

function init() {
 
  var select = d3.select("#selDataset");

  
  d3.json("samples.json").then((data) => {
    var Names = data.names;

    Names.forEach((sample) => {
      select
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    
    var firstSample = Names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
