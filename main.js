var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var template = require('./lib/template.js');
const { json } = require('stream/consumers');

// 전역변수로 사용하면 다른 사용자가 접속해도 같은 변수를 사용하게 되는 문제 있음
// 나중에 쿠키 기반으로 변경해야겠다
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
        // console.log('[list]currentMember: ',currentMember);
        // console.log('[list]currentMemberId: ',currentMemberId);

        // 현재 유저 정보 변경
        fs.readFile('data/members.json', 'utf8', function(err, jsonFile){
            var jsonData = JSON.parse(jsonFile);
            var members = jsonData.members;
            currentMember = members.find(member => {
                if(member.id == currentMemberId){
                    return member;
                }
            });
            console.log('[list]currentMember: ',currentMember);
        })

        // query-string에 따라 html 렌더링
        if(queryData.id === undefined){
            fs.readFile('data/posts.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                var posts = jsonData.posts;
                var list_list_box = template.list_list_box(posts);
                
                var list_html = template.list_html(list_list_box, currentMember);
                
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
            var voting_power = parseInt(post.voting_power);
            console.log(voting_power);
            // json 데이터 가져와서 변경하기
            fs.readFile('data/members.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                console.log(jsonData);

                var members = jsonData.members;
                members.find(member => {
                    if(member.id == currentMemberId){
                        member.voting_power += voting_power;
                    }
                });
                
                
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
            var voteTotal = 0;
            console.log('voteData: ',voteData);
            // json 데이터 가져와서 변경하기
            fs.readFile('data/posts.json', 'utf8', function(err, jsonFile){
                var jsonData = JSON.parse(jsonFile);
                console.log(jsonData);
                var posts = jsonData.posts;
                posts.find(post => {

                    if (post.id == parseInt(post_id)){
                        for (var i=0; i < post.options.length; i++) {
                            var option_id = "option_id=" + i.toString();
                            // console.log('option_id: ', option_id);

                            // 이미 투표했는지 확인
                            var check_voted = post.options[i].detail.find(element => {
                                if (element.member_id == currentMemberId){
                                    console.log('element: ',element);
                                    return element;
                                }
                            });
                            // console.log('check_voted: ', check_voted);
                            if (check_voted == undefined) {
                                // ! 객체가 갖고 있는 프로퍼티 명이 아니라 내가 만든 변수명으로 찾고 싶을 때는 .이 아니라 []안에 넣어야 한다.
                                // 이거 ㄴㄴ
                                // console.log('voteData.option_id: ', voteData[option_id]);
                                // 이거 ㅇㅇ
                                // console.log('voteData[option_id]: ', voteData[option_id]);
                                voteTotal += parseInt(voteData[option_id]);
                                post.options[i].count += parseInt(voteData[option_id]);
                                post.options[i].detail.push({"member_id":currentMemberId,"vote":parseInt(voteData[option_id])})
                            } else {
                                // response.write("<script>alert('Already voted');</script>");
                                // // response.writeHead(302, { Location: `/` })    //리다이렉션
                                // response.end();
                            }

                        }
                    }
                })
                // console.log('currentMember.voting_power',currentMember.voting_power);
                // console.log('voteTotal',voteTotal);
                // Check: voting power 전부 사용했는지 (이미 투표했다면 조건 만족하지 못함)
                if (currentMember.voting_power == 0 || voteTotal == currentMember.voting_power) {
                    
                    // posts json 변경
                    // 변경한 json 데이터로 파일 덮어쓰기
                    fs.writeFile('data/posts.json', JSON.stringify(jsonData), 'utf8', function(err){
                        response.writeHead(302, {Location: `/list?id=${post_id}`})    //리다이렉션
                        response.end();
                    });

                } else {
                        // response.write("<script>alert('Use all your voting powers');</script>");
                        // // response.writeHead(302, { Location: `/` })    //리다이렉션
                        // response.end();
                }
                
            });
        });

    
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);