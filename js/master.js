var githubaccount;
var projectlang = [];


function ObjLang(name,bytes) {
  this.name = name;
  this.bytes = bytes;
}

//files grab
//https://api.github.com/repos/planetbridging/Python/git/trees/master?recursive=1

//user
//https://api.github.com/users/planetbridging/repos

//get languages
//https://api.github.com/repos/planetbridging/gogetgalaxy/languages

//get tree
//https://api.github.com/repos/planetbridging/Python/git/trees/master

$( document ).ready(function() {

	console.log("Welcome to planetbridging");
  LoadGithub();
});


function LoadFile(file,id){
  $.get(file, function(data){
    //console.log(data);
      //$(this).children("div:first").html(data);
      $("#"+id).html(data);
  });
}

function LoadGithub(){
  $.ajax({
    url: "json/repos.json",
    jsonp: true,
    method: "GET",
    dataType: "json",
    success: function(res) {
      githubaccount = res;
      githubaccount.forEach(LoadPage);
      $("#ProjectCount").html(githubaccount.length);
      //UpdateLanguages();
    }
  });
}

function UpdateLanguages(lng,bytes){
  var found = false;
  for (var i = 0; i < projectlang.length; i++) {
    if(projectlang[i].name == lng){
      projectlang[i].bytes += bytes;
      found = true;
      break;
    }
  }
  if(!found){
    let tmpobj = new ObjLang(lng,bytes);
    projectlang.push(tmpobj);
  }
  var max = MaxBytes();
  $("#Languages").html("");
  for (var i = 0; i < projectlang.length; i++) {
    if(projectlang[i] != null){
      var percent = Math.round((projectlang[i].bytes/max)*100);
      $("#Languages").append(GetBadge(projectlang[i].name + ": " + percent+"%"));
    }
  }
}

function MaxBytes(){
  var max = 0;
  for (var i = 0; i < projectlang.length; i++) {
    max += projectlang[i].bytes;
  }
  return max;
}

function BytesBreakDown(id,json){

  $.ajax({
    url: "json/"+json+".json",
    jsonp: true,
    method: "GET",
    dataType: "json",
    success: function(res) {
      //console.log(res);
      //console.log(Object.keys(res));
      /*var lst = Object.keys(res);
      for (var i = 0; i < lst.length; i++) {
        if(!projectlang.includes(lst[i])){
          projectlang.push(lst[i]);
          console.log(res[lst[i]][0] + "yayyy");
        }
      }
      UpdateLanguages();*/
      var total = 0;
      for ( var i in res ){
        /*if(!projectlang.includes(i)){
          projectlang.push(i);
        }*/
        total += res[i];
         // console.log(i + '=' +  res[i] );
      }
      
      for ( var i in res ){
        var percent = Math.round((res[i]/total)*100);
        $("#" + id + "lng").append(GetBadge(i + ': ' +  percent + "%"));
        UpdateLanguages(i,res[i]);
      }
      
    }, 
    error: function(abc) {
        //alert(abc.statusText);
    }, 
    cache: false
  });
}

function LoadPage(item,index){
  //console.log(item);
  
  var language = GetBadge(item['language']);
  var lst = "<ul class='list-group list-group-flush'>";

  if(item['language'] == null){
    language = "";
  }else{
    //lst += "<li class='list-group-item bg-dark'><div id='"+item['id']+"lng'></div></li>";
  }

  var createddate = new Date(item['created_at']);
  var lastupdatedate = new Date(item['updated_at']);

  lst += "<li class='list-group-item bg-dark'><p class='text-center'>Created: "+GetDateTime(createddate)+"</p></li>";
  lst += "<li class='list-group-item bg-dark'><p class='text-center'>Last Update: "+GetDateTime(lastupdatedate)+"</p></li>";
  lst += "<li class='list-group-item bg-dark'><p class='text-center'>Age: "+TimeDifference(createddate,lastupdatedate)+"</p></li>";
  

  /*if(!projectlang.includes(item['language'])){
    //projectlang.push(item['language']);
  }*/
  
  lst += "</ul>";

  var link = "<a target='_blank' href='https://github.com/planetbridging/"+ item['name']+"'>link to repository</a>";

  var source =  "<div class='card text-white bg-dark CardsMinWidth'>";
  source += "<div class='card-header'>"+ link + "</div>";
  source += "<div class='card-body'>";
  source += "<h5 class='card-title'>"+item['name'] +"</h5>";
  source += "<p class='card-text'></p>";
  source += "</div>";
  source += lst;
  source += "<div class='card-footer text-muted'>";
  source += "<div id='"+item['id']+"lng'></div>";
  source += "</div>";
  source += "</div>";

  $("#LoadPublicProjects").append(source);
  BytesBreakDown(item['id'],item['name']);
  //console.log(item['language']);
  //LoadLanguages(item['name']);

}

/*
function LoadLanguages(name){
  $.ajax({
    url: "https://api.github.com/repos/planetbridging/"+name+"/languages",
    jsonp: true,
    method: "GET",
    dataType: "json",
    success: function(res) {
      console.log(res);
      //console.log(Object.keys(res));
      //res.forEach(AppendLanguages);
    }
  });
}

function AppendLanguages(item,index){
  console.log(item);
}*/


function GetDate(d){
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return`${da}-${mo}-${ye}`;
}

function GetDateTime(d){
  var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
  d.getHours() + ":" + d.getMinutes();
  return datestring;
}

function GetBadge(txt){
  var output = "<span class='badge badge-light'>"+txt+"</span>";
  return output;
}

function TimeDifference(date1,date2){
    var msec = date2 - date1;
    var mins = Math.floor(msec / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    var yrs = Math.floor(days / 365);
    var txt = days + " days, " + hrs + " hours, " + mins + " minutes";
    return txt;
}