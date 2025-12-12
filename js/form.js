    // 登録フォームへ移動
    $('#toForm').on('click',function(){
        window.location.href = "form.html";//フォームに移動
    });

    // ホームへ戻る
    $('#toHome').on('click',function(){
        window.location.href = "index.html";//ホームに移動
    });

    // 日時をいい感じの形式にする関数
    function convertTimestampToDatetime(timestamp) {
    const _d = timestamp ? new Date(timestamp * 1000) : new Date();
    const Y = _d.getFullYear();
    const m = (_d.getMonth() + 1).toString().padStart(2, '0');
    const d = _d.getDate().toString().padStart(2, '0');
    const H = _d.getHours().toString().padStart(2, '0');
    const i = _d.getMinutes().toString().padStart(2, '0');
    const s = _d.getSeconds().toString().padStart(2, '0');
    return `${Y}/${m}/${d} ${H}:${i}:${s}`;
    }

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    doc,
    getDoc,
    } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
        authDomain: "macchong1207.firebaseapp.com",
        projectId: "macchong1207",
        storageBucket: "macchong1207.firebasestorage.app",
        messagingSenderId: "575725288300",
        appId: "1:575725288300:web:6e1fd522d814bd1b8c9149"
    };

        // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);//データベースに接続する

    const cloudName = 'dpauiilsk';
    const uploadPreset = 'ol7oicef';

    let selectedFile = null;

    $('#uploadButton').on('click',function(e){//ボタンクリックアクション
        e.preventDefault();//eを停止する＝ボタンを押せなくする
        $('#imageInput').click();//イメージインプットを強制クリックする
    });

    $('#imageInput').on('change',function(event){//idの中身が変わった時に以下定義
        const file = event.target.files[0];//画像を格納する箱
        if (!file)return;//選択されてなかったら終了

        if (!file.type.startsWith('image/')) { // ファイルが存在し、画像ファイルかチェック
            alert('画像ファイルを選択してください');
            return;
        }

        selectedFile = file;//選んだファイルオブジェクトを保持しておき、あとで Cloudinary などにアップロードするときに使うために代入

        const reader = new FileReader();//ローカルファイルからURLに変換
        reader.onload = function(e) {//読み込み成功で以下定義
            $('#previewImage').attr('src', e.target.result);//読み込んだデータをブラウザにプレビューする
        };
        reader.readAsDataURL(file);//実際にファイル読み込み
    });

    // 「Firestore 形式のデータ」を入力して「配列形式のデータ」を出力する関数を追加する
    function chatDocuments(fireStoreDocs) {
    const documents = [];//箱
    fireStoreDocs.forEach(function (doc) {
        documents.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    return documents;
    }

    // 「配列形式にしたチャットのデータ」を入力して「表示用のタグにいれて」出力する関数を追加する
    function chatElements(chatDocuments) {
    const elements = [];
    chatDocuments.forEach(function (document) {
        elements.push(`

        <div class="post">
            <img src="${document.data.imageUrl}" class="icon">
            <div class="selectList">
                <li id="${document.id}" class="postList">
                    <p>氏　名：${document.data.name}</p> 
                    <p>価　格：${document.data.plan}</p>
                    <p>活動エリア：${document.data.area}</p>
                    <p>経歴・資格：${document.data.qualification}</p>
                    <p>プロフィール：${document.data.profile}</p>
                    <p>登録日時：${convertTimestampToDatetime(document.data.time.seconds)}</p>
                    <button class="deleteButton" data-id="${document.id}">削除</button>
                </li>
                <button type="button" class="likeButton" data-like-id="${document.id}">
                <svg class="likeButton__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M91.6 13A28.7 28.7 0 0 0 51 13l-1 1-1-1A28.7 28.7 0 0 0 8.4 53.8l1 1L50 95.3l40.5-40.6 1-1a28.6 28.6 0 0 0 0-40.6z"/></svg>
                いいね
                </button>
            </div>
        </div>
        `);
    });
    return elements;
    }

    // 送信したらファイアベースにデータ保存
    $('#send').on('click', async function(){//非同期処理
        if(!selectedFile){//画像が選択されてなかったら
            alert("画像を選択してください")
            return;
        }

        const name = $('#name').val();
        const profile = $('#profile').val();
        const qualification = $('#qualification').val();
        const area = $('#area').val();
        const plan = $('#plan').val();
    
        const formData = new FormData();//新しいファームデータを作ってformDataに入れる
        formData.append('file', selectedFile);//fileのselectedFileを追加＝送信準備
        formData.append('upload_preset', uploadPreset);//Cloudinaryのupload_presetを追加

        let imageUrl = "";

        try { //例外が発生する可能性のある処理
            const result = await $.ajax ({//リロードなしで以下取得
                url: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                method: 'POST',
                data: formData,
                processData: false,//自動文字列化防止
                contentType: false,//データ形式を自動で変更不可                
            });
            imageUrl = result.secure_url;
            alert('登録が完了しました');
        } catch (err) { //例外が発生した場合の書ろい
            console.error(err); //errorをコンソールに表示
            alert("Cloudinary アップロードに失敗しました");
            return;
        }

        // Firestoreへ保存するフェーズ
        const data = {
            name,
            profile,
            qualification,
            area,
            plan,
            imageUrl,
            time: serverTimestamp()
        };
        
        await addDoc(collection(db, 'form'), data); //データをdbのformに保存

        // フォームをリセット
        $('#name').val('');
        $('#plan').val('');
        $('#profile').val('');
        $('#qualification').val('');
        $('#area').val('');
        $('#previewImage').attr('src', '');
        selectedFile = null;
    });

    // ファイアベースからデータを取得
    const q = query(collection(db, 'form'), orderBy('time', 'desc'));
    onSnapshot(q, (querySnapshot) => {
        // 謎のデータを綺麗なデータに変換する
        const documents = chatDocuments(querySnapshot.docs);//綺麗に整理する
        console.log(documents);

        // 綺麗なデータをタグに入れる
        const elements = chatElements(documents);
        $('#output').html(elements);//タグを出力する
  

        $('.likeButton').each(function(){

            const id = $(this).data('like-id');
            // localStorage から状態を取得
            const saved = localStorage.getItem('like_' + id);
            // 以前いいねされていたら復元
            if (saved === '1') {
                $(this).addClass('liked');
            }
        });
    }); 

        // Likeボタンクリックでアクション
        $(document).on('click', '.likeButton', function(){
            // このボタンの識別IDを取得
            const btnId = $(this).data('like-id');

            // liked クラスを付けたり外したりする（トグル）
            $(this).toggleClass('liked');

            // liked クラスが付いているかチェック
            if ($(this).hasClass('liked')) {

                // 付いている → localStorage に保存
                localStorage.setItem('like_' + btnId, '1');

            } else {

                // 外された → localStorage から削除
                localStorage.removeItem('like_' + btnId);
            }
        });

    // 削除処理
    $(document).on('click', '.deleteButton', async function() {
        const id = $(this).data('id'); // クリックされたボタンのドキュメントIDを取得
        if (!confirm('本当に削除しますか？')) return;

        try {
            await deleteDoc(doc(db, 'form', id));
            localStorage.removeItem('like_' + id); // ← 削除時に like も消す
            alert('削除しました');
        } catch (err) {
            console.error(err);
            alert('削除に失敗しました');
        }
    });

    // お気に入りだけ表示
    $('#favoriteList').on('click', function () {

        // 現在 Firestore から描画された likeButton の番号から
        // 「いいね済みの番号一覧」を作る
        const likedIds = [];

        // localStorage に「like_◯◯（doc.id）」で保存されているものを全部集める
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('like_')) {
                likedIds.push(key.replace('like_', ''));
            }
        });

        // Firestore から取得した全データは「documents」に入ってるので、
        // お気に入りだけを抽出して再描画する
        const q = query(collection(db, 'form'), orderBy('time', 'desc'));
        onSnapshot(q, (querySnapshot) => {

            const allDocs = chatDocuments(querySnapshot.docs);

            // お気に入り番号だけ抽出 doc.idがローカルストレージに存在するものだけを抽出
            const favoriteDocs = allDocs.filter(doc =>
                likedIds.includes(doc.id)
            );

            // HTMLへ描画
            const elements = chatElements(favoriteDocs);
            $('#output').html(elements);

            // 描写後にlike状態を維持
            $('.likeButton').each(function(){
                const id = $(this).data('like-id');
                const saved = localStorage.getItem('like_' + id);
                if(saved === '1'){
                    $(this).addClass('liked');
                }
            });

        });

    });

    // 全件表示：お気に入りフィルター解除
    $('#allList').on('click', function () {
        const q = query(collection(db, 'form'), orderBy('time', 'desc'));

        onSnapshot(q, (querySnapshot) => {
            const documents = chatDocuments(querySnapshot.docs);
            const elements = chatElements(documents);
            $('#output').html(elements);

            // like 状態を復元
            $('.likeButton').each(function(i){
                const id = $(this).data('like-id');

                const saved = localStorage.getItem('like_' + id);
                if (saved === '1') {
                    $(this).addClass('liked');
                }
            });
        });
    });