    
    // 日付のセレクトボックス
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

    $('#year').html(year);
    $('#month').html(month);
    $('#day').html(date); 

const set =
`<div class="maintext">
    <div class="weight-wrap">
        <textarea class="weight"></textarea>
        <p class="kg">kg</p>
    </div>
    <div class="rep-wrap">
        <textarea class="rep"></textarea>
        <p class="count">回</p>
    </div>
    <div class="RM">
        <p class="RM1">RM換算値</p>
        <p class="max">RM<span class="maxcal">0</span>kg</p>
    </div>
</div>`;


// 動的追加：イベントデリゲーションで対応
$(document).on('click', '.addset', function(){
    $(this).closest('.setbutton').before(set);
});

    
// ------ 種目追加（ID→class） ------
const form =
`<div class="textarea">
    <div class="SBD">
        <div class="sbd">
            <select name="menu" class="menu">
                <option value="" disabled selected>選択してください</option>
                <option value="sq">スクワット</option>
                <option value="bp">ベンチプレス</option>
                <option value="dl">デッドリフト</option>
            </select>
        </div>
    </div>

    <div class="maintext">
        <div class="weight-wrap">
            <textarea class="weight"></textarea>
            <p class="kg">kg</p>
        </div>
        <div class="rep-wrap">
            <textarea class="rep"></textarea>
            <p class="count">回</p>
        </div>
        <div class="RM">
            <p class="RM1">RM換算値</p>
            <p class="max">RM<span class="maxcal">0</span>kg</p>
        </div>
    </div>

    <div class="setbutton">
        <button class="addset">＋</button>
    </div>
</div>`;

$('.addform').on('click',function(){
    $('.addform').before(form);
});


// ---------- 保存処理（複数フォーム対応） ----------
$('#save').on('click',function(){
    const y = $('#year').val();
    const m = $('#month').val();
    const d = $('#day').val();

    const dateSelect = `${y}-${m}-${d}`;

    // 追加前の最大値を取得
    let oldData = JSON.parse(localStorage.getItem('memory') || '[]');
    // 種目別最大値を作る
    const oldMaxByMenu = {};
    oldData.forEach(item => {
        const program = item.menu;
        const max = Number(item.max);
        if (!oldMaxByMenu[program] || max > oldMaxByMenu[program]) {
            oldMaxByMenu[program] = max;
        }
    });

    // 箱
    const memories = [];
    // テキストエリアから値を取得
    $('.textarea').each(function() {
        const menu = $(this).find('.menu').val();

        // この textarea 内の全てのセットを取得
        $(this).find('.maintext').each(function() {
            const weight = $(this).find('.weight').val();
            const rep = $(this).find('.rep').val();
            if(weight && rep){
                const w = Number(weight);
                const r = Number(rep);
                const max = w * r / 40 + w;

                // RM表示も更新
                $(this).find('.maxcal').text(max);


                memories.push({
                    date: dateSelect,
                    menu,
                    weight,
                    rep,
                    max
                });
                console.log(max);

                const $RM1 = $(this).find('.RM1');

                const oldMax = oldMaxByMenu[menu] || -Infinity;

                if(max > oldMax){
                    $RM1.text('PR');
                    $RM1.css('color', 'red');
                    oldMaxByMenu[menu] = max;// セットごとにデータを更新
                } else {
                    $RM1.text('RM換算値');
                    $RM1.css('color', 'black');
                };

            };

        });
    });

        // json
        const json = JSON.stringify(memories);
        console.log(json);

        // localStrageに追加
        localStorage.setItem('memory',json);
        alert("保存しました");
    });

    $('#clear').on('click',function(){
        localStorage.removeItem("memory");
        localStorage.removeItem("rm");
        alert("削除しました");

        $('.menu').val('');
        $('.weight').val('');
        $('.rep').val('');
        $('#year').val('');
        $('#month').val('');
        $('#day').val('');
        $('.RM1').text('RM換算値');        
        $('.RM1').css('color', 'black');
    });
