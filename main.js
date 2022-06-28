var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var template = require('./lib/template.js');
const { json } = require('stream/consumers');

var currentMemberId = null;
var currentMember = null;

var app = http.createServer(function (request, response) {

    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        var html = template.home_html();
        response.writeHead(200);
        response.end(html);
    } else if (pathname === '/login') {
    
        var body = '';
        // data, end 이벤트를 감지해서 전송된 데이터 가져오기
        request.on('data', function (data) {
            body = body + data;
        })
        request.on('end', function () {
            // 전송된 데이터를 객체로 전환
            var post = qs.parse(body);
            var id = post.id;
            var pw = post.pw;
            fs.readFile('data/members.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                var members = jsonData.members;
                var memberInfo = null;
                memberInfo = members.find(member => {
                    if(member.id == id && member.pw == pw){
                        currentMemberId = id;
                        console.log(currentMemberId);
                        currentMember = members.find(member => {
                            if(member.id == currentMemberId){
                                return member;
                            }
                        });
                        console.log(currentMember);

                        response.writeHead(302, { Location: `/list` })    //리다이렉션
                        response.end();
                    }
                })
                // 로그인 오류 처리 메시지
                // if (memberInfo == null) {
                //     response.write("<script>alert('Error');</script>");
                //     // response.writeHead(302, { Location: `/` })    //리다이렉션
                //     response.end();
                // }
                
            })
        })

    } else if (pathname === '/list') {
        // console.log("queryData: ",queryData);
        // console.log("queryData.id: ",queryData.id);

        if(queryData.id === undefined){
            fs.readFile('data/posts.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                var posts = jsonData.posts;
                var list_list_box = template.list_list_box(posts);
    
                var list_html = template.list_html(list_list_box);
                
                response.writeHead(200);
                response.end(list_html);
            })
        } else {
            fs.readFile('data/posts.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                var posts = jsonData.posts;
                var selectedPost = posts.find(post => {
                    if(post.id == queryData.id){
                        return post;
                    }
                })
                var html = template.post_detail(selectedPost, currentMember);
                
                response.writeHead(200);
                response.end(html);
            })
        }
        

    } else if(pathname === '/buy'){

        var body = '';
        // data, end 이벤트를 감지해서 전송된 데이터 가져오기
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            // 전송된 데이터를 객체로 전환
            var post = qs.parse(body);
            var voting_power = post.voting_power;
            console.log(voting_power);
            // json 데이터 가져와서 변경하기
            fs.readFile('data/members.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                console.log(jsonData);

                var members = jsonData.members;
                currentMember.voting_power = voting_power;
                
                console.log(jsonData);
                // 변경한 json 데이터로 파일 덮어쓰기
                fs.writeFile('data/members.json', JSON.stringify(jsonData), 'utf8', function(err){
                    response.writeHead(302, {Location: `/list`})    //리다이렉션
                    response.end();
                });
            });
        });

    
    } else if(pathname === '/vote'){

        var body = '';
        // data, end 이벤트를 감지해서 전송된 데이터 가져오기
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            // 전송된 데이터를 객체로 전환
            var voteData = qs.parse(body);
            var post_id = voteData.post_id;
            console.log('voteData: ',voteData);
            // json 데이터 가져와서 변경하기
            fs.readFile('data/posts.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                console.log(jsonData);
                var posts = jsonData.posts;
                posts.find(post => {
                    if (post.id == jsonData.post_id){
                        for (var i=1; i <= length(post.options); i++) {
                            var option_id = "option_id=" + i.toString();
                            options[i].count += ParseInt(jsonData.option_id);
                            options[i].detail.push({"member_id":currentMemberId,"vote":ParseInt(jsonData.option_id)})
                        }
                    }
                })

                // 변경한 json 데이터로 파일 덮어쓰기
                fs.writeFile('data/members.json', JSON.stringify(jsonData), 'utf8', function(err){
                    response.writeHead(302, {Location: `/list?id=${post_id}`})    //리다이렉션
                    response.end();
                });
            });
        });

    
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);