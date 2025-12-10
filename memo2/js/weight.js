
function selectBoxCreate(start, end) {
    let str ="";
    for(let i=start; i<end; i++){
        str += `<option>${i}</option>`;
    }
    return str;
}

    const year = selectBoxCreate(2025,2030);
    const month = selectBoxCreate(1,13);
    const date = selectBoxCreate(1,32);

    $('#view').html(year);
    $('#view2').html(month);
    $('#view3').html(date); 


// 履歴を残す箱
const labels = [];//日付
const weights = [];//体重
const BMI = [];//BMI

// 体重の推移
const ctx = document.getElementById("mychart");   
console.log(ctx);

const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets:[{
        label: '体重（kg）',
        data: weights,
        borderColor: '#0000FF',
        }]
    },
    options: {
        scales: {
            y: {
                suggestedMin: 60,
                suggestedMax: 90,
                ticks: {
                    stepSize: 5,
                }
            }

        }
    }
});

// BMIの推移
const ctx2 = document.getElementById("mybmi");   
console.log(ctx2);

const lineChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: labels,
        datasets:[{
        label: 'BMI（%）',
        data: BMI,
        borderColor: '#00CC00',
        }]
    },
    options: {
        scales: {
            y: {
                suggestedMin: 18,
                suggestedMax: 25,
                ticks: {
                    stepSize: 0.5,
                }
            }

        }
    }
});


// saveクリックで保存
$('#save').on('click',function(){
    // 年月日を変数に変換
    const y = $('#view').val();
    const m = $('#view2').val();
    const d = $('#view3').val();

    // 一つの変数に変換
    const dateSelect = `${y}-${m}-${d}`;
   
    const bodyWeight = { 
        date: dateSelect, //変数dateのデータを取得
        weight: $('#weight').val(), //id=weightのデータを表示   
        height: $('#height').val() //id=heightのデータを表示
    };
    console.log(bodyWeight);

    // 履歴を残す
    labels.push(bodyWeight.date);
    weights.push(bodyWeight.weight);
    
    // データを数値に変換(必要？)
    const w = Number(bodyWeight.weight);
    const h = Number(bodyWeight.height);
    
    // BMIの計算
    const bmi = w / (h/100) **2;
    // BMIの表示
    $('#BMI').html('<p>BMI:' + bmi.toFixed(2) + '%</p>');
    
    //BMIの履歴を残す
    BMI.push(bmi);


    // グラフの数値をローカルストレージに保存
    const history = {
        labels: labels,
        weights: weights,
        BMI: BMI
    }

    // jsonに変換
    const json = JSON.stringify(bodyWeight);
    console.log(json);

    const historyJson =JSON.stringify(history);
    console.log(history);

    // ローカルストレージに残す
    localStorage.setItem('memo',json);
    localStorage.setItem('history',historyJson);

    //グラフに表示
    lineChart.update();
    lineChart2.update();

});

    // クリアボタン押したらローカルストレージから削除、画面からも消す
$('#clear').on('click',function(){
    localStorage.removeItem('memo');
    localStorage.removeItem("history");
    labels.length = 0;
    weights.length = 0;
    BMI.length = 0;
    $('#view').val('');
    $('#view2').val('');
    $('#view3').val('');
    $('#weight').val('');
    $('#height').val('');
});

    // 読み込み時にデータ取得
if(localStorage.getItem('memo')){
    const json = localStorage.getItem('memo');
    console.log(json);

    // オブジェクトに戻す
    const bodyWeight = JSON.parse(json);
    const parts =bodyWeight.date.split('-');

    $('#view').val(parts[0]);//年
    $('#view2').val(parts[1]);//月
    $('#view3').val(parts[2]);//日

    // $('#weight').val(bodyWeight.weight);
    $('#height').val(bodyWeight.height);
    console.log(bodyWeight);

}

if(localStorage.getItem('history')){
    const historyJson = localStorage.getItem('history');

    // オブジェクトに戻す
    const history = JSON.parse(historyJson);

    labels.push(...history.labels);
    weights.push(...history.weights);
    BMI.push(...history.BMI);

    lineChart.update();
    lineChart2.update();

}


