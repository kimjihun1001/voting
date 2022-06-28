module.exports = {
    home_html: function() {
        var html = `
        <!doctype html>
        <html>
        
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <title>NA DAO</title>
            <meta charset="utf-8">
        </head>
        
        <body>
            <div class="container">
                <h1 class="display-1 border-bottom border-5 border-warning">NA DAO</h1>
                <div class="text-end">
                    <a href="http://www.flask.global" class="btn btn-dark align-end">Flask Homepage</a>
                </div>
                <image src="https://github.com/kimjihun1001/voting/blob/master/lib/home_logo_naoda.png?raw=true" class="img-fluid mx-auto d-block"></image>
                <h2 class="row justify-content-end">Welcome!</h2>
                <h2 class="row justify-content-end">Log in to join the NA DAO</h2>
                <form action="login" method="post" style="height:80px;" class="d-flex justify-content-end">
                    <div class="w-25 me-3" style="float:left;">
                        <input name="id" type="text" placeholder="Id" class="align-middle form-control mb-1">
                        <input name="pw" type="password" placeholder="Password" class="align-middle form-control">
                    </div>
                    <div class="h-100">
                        <input type="submit" value="로그인" method="post" class="btn btn-primary align-middle h-100">
                    </div>
                </form>
            </div>
        
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        </body>
        
        </html>
        `;
        return html;
    },

    list_html: function(list, currentMember){
        var html = `
        <!doctype html>
        <html>
        
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <title>NA DAO</title>
            <meta charset="utf-8">
        </head>
        
        <body>
            <div class="container">
                <h1>NA DAO</h1>
                <h2>안녕하세요, ${currentMember.id}님</h2>
                <h2>최근 NA DAO 운영 방향과 관련된 안건 목록입니다.<br>관심있는 안건을 살펴보고 투표하세요! </h2>
                <h3>투표에 참여하기 위해서는 의결권이 필요합니다</h3>
                <h4>보유중인 의결권: ${currentMember.voting_power}</h4>
                <form action="buy" method="post">
                    <select name="voting_power" class="btn btn-secondary">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <input type="submit" value="의결권 구매하기" class="btn btn-warning">
                </form>
                <div name="list_box">
                    ${list}
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        </body>
        
        </html>
        `;

        return html;
    },

    list_list_box: function(posts){

        var list = '<ul>';

        posts.forEach(post => {
            var id = post.id;
            var title = post.title;
            var content = post.content;

            list = list + `<li><a href="/list?id=${id}" class="btn btn-light">${title}</a></li>`;
        });

        list = list + '</ul>';

        return list;
    },
    
    post_detail: function(post, currentMember){

        var option_html = '';
        post.options.forEach(option => {
            option_html = option_html + `
                <span>
                    <p>${option.name}</p>
                    <p>득표율: ${option.count}</p>
                    <input type="number" name="option_id=${option.id}" placeholder="행사할 의결권 입력" value="0" min="0">
                </span>
                `
        });
        
        var html =`
        <!doctype html>
        <html>
        
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <title>NA DAO</title>
            <meta charset="utf-8">
        </head>
        
        <body>
            <div class="container">
                <h1>${post.title}</h1>
                <h2>${post.content} </h2>
                <p>보유중인 의결권: ${currentMember.voting_power}</p>
                <form action="vote" method="post">
                    <input hidden type="text" name="post_id" value=${post.id}>
                    <div>
                        ${option_html} 
                    </div>
                    <input type="submit" value="투표하기" class="btn btn-primary">
                </form>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        </body>
        
        </html>
            
        ` ;

        return html;
    }
}