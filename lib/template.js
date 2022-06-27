module.exports = {
    home_html: function() {
        var html = `
        <!doctype html>
        <html>
        
        <head>
            <title>NA DAO</title>
            <meta charset="utf-8">
        </head>
        
        <body>
            <h1>NA DAO</h1>
            <h2>안녕하세요. NA DAO에 참여하기 위해서 로그인해주세요.</h2>
            <form action="login" method="post">
                <input name="id" type="text" placeholder="Id">
                <input name="pw" type="password" placeholder="Password">
                <input type="submit" value="로그인" method="post">
            </form>
        </body>
        
        </html>
        `;
        return html;
    },

    list_html: function(list){
        var html = `
        <!doctype html>
        <html>
        
        <head>
            <title>NA DAO</title>
            <meta charset="utf-8">
        </head>
        
        <body>
            <h1>NA DAO</h1>
            <h2>최근 NA DAO 운영 방향과 관련된 안건 목록입니다.<br>관심있는 안건을 살펴보고 투표하세요! </h2>
            <h3>투표에 참여하기 위해서는 의결권이 필요합니다</h3>
            <form action="buy" method="post">
                <select name="voting_power" id="">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <input type="submit" value="의결권 구매하기">
            </form>
            <div name="list_box">
                ${list}
            </div>
        </body>
        
        </html>
        `;

        return html;
    },

    list_list_box: function(posts){

        var list = '<ul>';

        posts.forEach(post => {
            var no = post.no;
            var title = post.title;
            var content = post.content;

            list = list + `<li><a href="/list?id=${no}">${title}</a></li>`;
        });

        list = list + '</ul>';

        return list;
    }
}