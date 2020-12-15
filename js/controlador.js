var historial = []


var tipos = ["Diesel", "2 Tiempos", "4 Tiempos"]

var localStorage = window.localStorage;

if (localStorage.getItem('historial') == null) {
    localStorage.setItem('historial', JSON.stringify(historial));
} else {
    historial = JSON.parse(localStorage.getItem('historial'));
}

function actualizarHistorial() {
    document.getElementById("registros").innerHTML = ""
    for (let i = 0; i < historial.length; i++) {
        document.getElementById("registros").innerHTML += `
            <tr>
                <th scope="row">${historial[i].Fechas}</th>
                <td>${historial[i].Area}</td>
                <td>${historial[i].Tipo}</td>
                <td>${historial[i].Potencia}</td>
                <td>${historial[i].Tiempo}</td>
                <td>${historial[i].Consumo}</td>
                <td>${historial[i].Gasto}</td>
            </tr>
        `
    }
}

actualizarHistorial()

function calcular() {
    var hoy = new Date()
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    const area = parseFloat(document.getElementById('txtTerreno').value)
    const tipoMotor = parseFloat(document.getElementById('txtTipoMotor').value)
    const potencia = parseFloat(document.getElementById('txtPotencia').value)
    const pc = parseFloat(document.getElementById('txtPrecio').value)
    const min = parseFloat(document.getElementById('txtMin').value)
    const max = parseFloat(document.getElementById('txtMax').value)
    const capacidad = parseFloat(document.getElementById('txtCapacidad').value) //Capacidad del motor en litros
        //console.log(prueba)
        //  console.log(parseFloat(area))
    var areatemp = area
    var litros;
    var cl; // consumo en litros 
    var h = 0
    var arrayValores2 = []; // arreglo para los valores de la gráfica
    var promedio
    while (areatemp > 0) {
        promedio = Math.floor(Math.random() * (max - min) + min)
        if (areatemp >= promedio) {
            h++;
            valores = {
                y: promedio,
                x: h
            }
            areatemp = areatemp - promedio
        } else {
            h = h + areatemp / promedio
            valores = {
                y: areatemp,
                x: h
            }
            areatemp = 0
        }
        console.log(promedio)
        arrayValores2.push(valores);

    }
    var ttm = h; // tiempo total que trabajará el motor
    var tiempoLlenado
    var error = false
    if (tipoMotor === 0) {
        litros = 0.23
        tiempoLlenado = capacidad / (potencia * litros)
    }

    if (tipoMotor === 1) {
        litros = 0.31
        tiempoLlenado = capacidad / (potencia * litros)
    }

    if (tipoMotor === 2) {
        litros = 0.43
        tiempoLlenado = capacidad / (potencia * litros)
    }

    if (tiempoLlenado < ttm) {
        ttm = tiempoLlenado
        error = true
    }
    /*
        if (error) {
            $('#error').show();
        } else {
            $('#error').hide();
        }
           */
    if (tipoMotor === 0) {
        litros = 0.23
        cl = ttm * potencia * litros
    }

    if (tipoMotor === 1) {
        litros = 0.31
        cl = ttm * potencia * litros
    }

    if (tipoMotor === 2) {
        litros = 0.43
        cl = ttm * potencia * litros
    }
    console.log(cl)
    var gt = cl * pc // gasto total
    console.log('gasto', gt);
    console.log('consumo', cl)
    $("#txtConsumo").val(cl.toFixed(2));
    $("#txtGasto").val(gt.toFixed(2));

    console.log(ttm)
    var limitX = Math.ceil(ttm); // redondeando el valor de las horas totales
    console.log('x:', limitX);

    var arrayValores = []; // arreglo para los valores de la gráfica

    var chart = new CanvasJS.Chart("chartContainer", {
        height: 300,
        width: 300,
        axisY: {
            title: "Costo (Lps)",
        },
        axisX: {
            title: "Tiempo (hrs)",
        },
        title: {
            text: "Costo por Hora"
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
    for (let i = 0; i <= limitX; i++) {
        let valores = {
            x: i,
            y: Math.ceil((i * litros * potencia) * pc)
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
        } else {
            $('#error').show();
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
                updateChart2()
            }, updateInterval);
        } else {
            $(this).html('Play');
            clearInterval(interval);
        }
        flag = !flag;
    });



    var chart2 = new CanvasJS.Chart("chartContainer2", {
        height: 300,
        width: 300,
        axisY: {
            title: "Area (m2)",
        },
        axisX: {
            title: "Tiempo (hrs)",
        },
        title: {
            text: "Area Regada por Hora"
        },
        data: [{
            type: "column",
            dataPoints: [
                { x: 0, y: 0 } // mostrar valores antes de iniciar (se pueden quitar si queremos que cargue en blanco la gráfica)
            ]

        }]
    });
    chart2.render(); // cargar el gráfico


    var count2 = 0; //contador para ir corriendo los datos del arreglo
    function updateChart2() {
        chart2.render();
        if (count2 < arrayValores.length) {
            chart2.options.data[0].dataPoints.push({
                x: arrayValores2[count2].x,
                y: arrayValores2[count2].y
            })
            count2 = count2 + 1;
        }
    }


    let temp = {
        "Fechas": fecha + ' ' + hora,
        "Area": area,
        "Tipo": tipos[tipoMotor],
        "Potencia": potencia,
        "Tiempo": ttm,
        "Consumo": cl.toFixed(2),
        "Gasto": gt.toFixed(2)
    }
    historial.push(temp)
    localStorage.setItem('historial', JSON.stringify(historial));
    actualizarHistorial()
}

//console.log(Math.ceil(1.5)); // redondea al mayor