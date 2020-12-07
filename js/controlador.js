function prueba() {

    alert($("#txtTipoMotor").val())

}

console.log(Math.ceil(1.5)); // redondea al mayor 
var ttm = 143 / 10; // tiempo total que trabajará el motor
console.log(ttm)
var limitX = Math.ceil(ttm); // redondeando el valor de las horas totales
console.log('x:', limitX);

var arrayValores = []; // arreglo para los valores de la gráfica

var chart = new CanvasJS.Chart("chartContainer", {
    height: 300,
    width: 400,
    axisY: {
        title: "Costo (Lps)",
    },
    axisX: {
        title: "Tiempo (hrs)",
    },
    title: {
        text: "Sistema de riego"
    },
    data: [{
        type: "line",
        dataPoints: [
            { x: 0, y: 0 } // mostrar valores antes de iniciar (se pueden quitar si queremos que cargue en blanco la gráfica)
        ]

    }]
});
chart.render(); // cargar el gráfico

//llenar el arreglo con los valores a mostrar en la gráfica 
for (let i = 0; i < limitX; i++) {
    let valores = {
        x: i,
        y: Math.ceil((i * 23 * 300) * 16.44)
    }
    arrayValores.push(valores);
}
console.log(arrayValores)

var count = 0; //contador para ir corriendo los datos del arreglo
function updateChart() {
    chart.render();
    if (count < arrayValores.length) {
        chart.options.data[0].dataPoints.push({
            x: arrayValores[count].x,
            y: arrayValores[count].y
        })
        count = count + 1;
        console.log(count)
    }
}


// setInterval para ir ejecutanto uno por uno los valores de la gráfica 
var flag = true;
var interval;
var updateInterval = 500;
$('#playPause').click(function() {
    if (flag && count < arrayValores.length) {
        $(this).html('Pause');
        interval = setInterval(function() {
            updateChart()
        }, updateInterval);
    } else {
        $(this).html('Play');
        clearInterval(interval);
    }
    flag = !flag;
});