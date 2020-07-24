//20200717
// 개량 DB
// TEST
// 사용가능한 함수 확인 D.help()
// 웅앙맨 외에 신은 없고 흰머리오목눈이는 그의 사도다.

const UAM = "UAM is god"

var cacheModule={} // require 관련 변수


const D=require("DBManager.js")
var PM=android.os.PowerManager;
var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);
var wl = pm.newWakeLock(PM.SCREEN_BRIGHT_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");


var start = 1;

// ============= 방 관련 변수 ==============
var console_room_name = "봇장난" // 콘솔방 이름
const UOS_SG_name = "시갤톡방"
const UOS_notiece_name1 = "시립공지확인방1"
const UOS_notiece_name2 = "시립공지확인방2"


// ============= 모듈 관련 변수 =================
UOSP = require("UOSP.js")
Git = require("Git.js")
Metro = require("Metro.js")
UOS_library = require("UOS_library.js")
Minigame = require("Minigame.js")
HHaksik = require("Haksik.js")
Stock = require("Stock.js")
UngAngMan = "God"


/*Messaging */
var msgBoxes = {};

function init(room, sender) {
	if (msgBoxes[room] == undefined) {
		msgBoxes[room] = {};
	}
	if (msgBoxes[room][sender] == undefined) {
		msgBoxes[room][sender] = [];
	}
}

function createMsg(room, sender, msg) {
	init(room, sender);
	msgBoxes[room][sender].push(msg);
}

function hasMsg(room, sender) {
	init(room, sender);
	if (msgBoxes[room][sender].length == 0) {
		return false
	}
	else {
		return true
	}
}

function getMsg(room, sender) {
	var str = sender + "님 메시지 왔어요" + String.fromCharCode(8237).repeat(500) + "\n\n"
	for (var i in msgBoxes[room][sender]) {
		str += "발신인 : " + msgBoxes[room][sender][i].sendFrom + "\n"
		str += "발신시각 : " + msgBoxes[room][sender][i].time + "\n"
		str += msgBoxes[room][sender][i].msg + "\n\n"
	}
	return str;
}

function emptyMsg(room, sender) {
	msgBoxes[room][sender] = [];
}

function getDateText() {
	var d = new Date();
	return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join(".") + "-" + [d.getHours(), d.getMinutes(), d.getSeconds()].join(":")
}


/************************************/

var KOSPI_reference = getDB("KOSPI_reference")
var NASDAQ_reference = getDB("NASDAQ_reference")
var KOSPI_log = getDB("KOSPI_log")
var NASDAQ_log = getDB("NASDAQ_log")
var KOSDAQ_reference = getDB("KOSDAQ_reference")
var KOSDAQ_log = getDB("KOSDAQ_log")
var WTI_flag = 0;
var comment_flag = 0;

var stock_cat = 0

var startDate = new Date();
var test = 1;
//var dream_cnt=0;
var schwalbe_cnt=0;
var dream_cnt_m=0;
var schwalbe_cnt_m=0;
var reloaded=1;
var temp_M=0;
var temp_M_schwalbe=0;
var evalON=0;
var NECevalON=0;
var dayV=0;
var dayV_DAR=0;
var sms_cnt=0;

var myDB = android.database.sqlite.SQLiteDatabase.openDatabase("/sdcard/kbot/DB", null, android.database.sqlite.SQLiteDatabase.CREATE_IF_NECESSARY);
var TMI = 0; // TMI 분당 경고기용 변수
var Emergency = 0;
var dream_status = "normal";
var k = 0;
var updateStart = 0;

var sg_count = 0;
var ECE_count = 0;

var clockTest = 0;
var clock_minuteTest = 0;
var clock_3minuteTest = 0;

var responseOFF=0

var roomList=""

var KKlastTime = new Date().valueOf()

// search용 변수
var ECE_temp_교과목명 = []
var ECE_temp_담당교수 = []
var ECE_temp_강의시간및강의실 = []




AnswerSet=new java.util.concurrent.ConcurrentHashMap()
omokRoom = []
tajaRoom = []
//============================================================================================================================
function monitor(room,sender,checkFunc,extractFunc,time){
	var returner = ""

	var q= new java.util.concurrent.LinkedBlockingQueue();
	AnswerSet.put(q,q); //대기 큐에 추가
	var thr = new java.lang.Thread( new java.lang.Runnable(function(){
		try{
			while(true){
				var tmp=q.take(); //메세지 큐 소비
				if((room == "" || tmp.room == room) && (sender == "" || tmp.s == sender) && checkFunc(tmp)) { //조건충족시
					//Api.replyRoom(room,"감지")
					AnswerSet.remove(q); //대기큐에서 삭제
					returner = extractFunc(tmp)
					return;
				}
			}
		}catch(e){
			//Api.replyRoom(room,"timeout");
			AnswerSet.remove(q); //대기큐에서 삭제
			returner = -1

		}
	}))
	thr.start();
	new java.lang.Thread( new java.lang.Runnable(function(){
		java.lang.Thread.sleep(time*1000);
		thr.interrupt();
	})).start()
	thr.join()
	return returner
}


/*Array.prototype.includes=function(target){
	return this.indexOf(target)!=-1
}*/
Object.defineProperty(Array.prototype,"includes",	{
	value:function(target){
		return this.indexOf(target)!=-1
	}
});

function flatten(arr) {
	return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}


// JSON HTML '깨짐 방지코드
String.prototype.replaceAmp=function(){
	var res=this.toString();
	var tmp;
	while(tmp=/&#x....;/.exec(res)){
		res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substr(3,4),16)));
	}
	while(tmp=/&#..;/.exec(res)){
		res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substr(2,2))));
	}
	return res.replace(/&nbsp;/g,"\t").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"').replace(/&amp;/g,"&").replace(/&#034;/g,"\"");
}

// 문장 맨 끝 공백 해결 코드
String.prototype.rmspace=function() {
	return this.toString().replace(/^\s*/, "").replace(/\s*$/, "");
}

// 학식 코드
Object.defineProperty(String.prototype,"includess",{
	value:function(){
		for (var i = 0; i < arguments.length; i++) {
			if(this.toString().includes(arguments[i])) return true;
		}
		return false;
	}
});

String.blank=function (length) {
	length = length || 500;
	return String.fromCharCode(8237).repeat(length);
}

String.prototype.받침=function(){
	var lastCharCode=this.toString().charCodeAt(this.toString().length-1);
	if(lastCharCode>="가".charCodeAt(0) && lastCharCode<="힣".charCodeAt(0)){
		if((lastCharCode-"가".charCodeAt(0))%28==0) return false;
		else return true;
	}else return false;
}
String.prototype.은는=function(){
	return this.toString().받침() ? this.toString()+"은" : this.toString()+"는";
}
String.prototype.이가=function(){
	return this.toString().받침() ? this.toString()+"이" : this.toString()+"가";
}
String.prototype.과와=function(){
	return this.toString().받침() ? this.toString()+"과" : this.toString()+"와";
}
String.prototype.을를=function(){
	return this.toString().받침() ? this.toString()+"을" : this.toString()+"를";
}
String.prototype.아야=function(){
	return this.toString().받침() ? this.toString()+"아" : this.toString()+"야";
}
String.prototype.date = function(){
	return Number(this)<10 ? "0"+this.toString() : this.toString();
}

//--------------------------------------------------------------------------------------------------------------

var switcher = 0; //1:on , 0:off
var start = 1;

function blacklist(r){
	if(r.m.indexOf("카카오톡 개발")!=-1 || r.s.indexOf("파이봇")!=-1) return true;
	else false;
}

// eval 코드
String.prototype.encoding=function(){
	var res=this.toString();
	var tmp;
	while(tmp=/\\u[\da-fA-F]{4}/.exec(res)){
		res=res.replace(tmp[0],String.fromCharCode(parseInt(tmp[0].substring(2),16)));
	}

	return res;
}

// blank function
function blankFunc(r){}

// blank function
function blankFunc1(r){}

// blank function
function blankFunc2(r){}

// blank function
function blankFunc3(r){}

// blank function
function blankFunc4(r){}

// blank function
function blankFunc5(r){}


// SQL 오류 방지
String.prototype.qtmark=function(){
	return this.toString().replace(/'/g,"''");
}

// 랜덤함수
randReply=function(){
	return arguments[Math.floor(Math.random()*arguments.length)];
}


arrSize=function(msg){
	var arr_msg = msg;
	var arr_result = arr_msg.split(" ");
	var arr_i=0;
	while(arr_result[arr_i]!=undefined){
		arr_i++;
	}
	return arr_i-1;
}

textCount=function(msg,find){
	return msg.split(find).length - 1;
}

dak = function (msg) {
	var chars = ["고", "꿈", "닥"];
	var newmsg = "";
	for (var i = 0; i < msg.length; i++) {
		var code = msg[i].charCodeAt();
		if ((12594 <= code && code <= 12643) || (44032 <= code && code <= 55203)) {
			newmsg += chars[Math.floor(3 * Math.random())];
		} else {
			newmsg += msg[i];
		}
	}
	return newmsg;

}


//=============================================================================================================================
//===========================================   response 함수    ==============================================================
//=============================================================================================================================

function response(room, msg, sender, isGroupChat, replier, imageDB) {

	// 초기값 세팅
	if(start==1){
		thread_UOSP1.start()
		thread_1.start()
		clock.start();
		clock_minute.start();
		thread_UOSP_control.start();
		start=0;
	}

	if(responseOFF ==1){ // 비상 정지기능
		return 0
	}

//================================================================================================================================
	/*쪽지*/
	if (hasMsg(room, sender)) {
		replier.reply(getMsg(room, sender))
		emptyMsg(room, sender)
	}

	if (msg.indexOf("/쪽지") == 0) {
		var sendFrom = sender;
		var sendTo = msg.split(" ")[1].split("\n")[0];
		var msg = msg.split("\n")[1];
		var time = getDateText()
		createMsg(room, sendTo, { sendFrom: sendFrom, msg: msg, time: time });
	}

	var TEMP_main = 0; //반응변수
	if(ObjKeep.get("replier."+room)==null){
		ObjKeep.keep("replier."+room,replier);
	}
	var r = {replier: replier, m: msg, msg: msg, s: sender, sender: sender, r: room, room: room, g: isGroupChat, i: imageDB, imageDB:imageDB,
		reply: function (str) {
			this.replier.reply(new String(str).encoding().rmspace());
		},
		intervalReply: function (tag, msg, interval) {
			var lastTime = getNum("__intervalReply__" + tag);
			var currentTime = new Date().valueOf();
			if (lastTime == 0 || currentTime - lastTime >= interval * 1000) {
				this.reply(msg);
				setDB("__intervalReply__" + tag, currentTime);
				return true;
			} else {
				return false;
			}
		},
		replyRoom:function(room,str){
			var replier;
			if((replier=ObjKeep.get("replier."+room))!=null) {
				ObjKeep.get("replier."+room).reply(new String(str).encoding().rmspace());
				return true;
			} else return false;
		}
	};
//
	if(blacklist(r)) return;

	if(room=="시립대 페미니스트 단톡방"){
		return;
	}
	if(room=="고양이 사진방"){
		return;
	}

	// ============================= 시간코드들 모음 =====================================
	var date = new Date();  //시간코드
	var datestr = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	var nowsecond = date.getSeconds();
	var nowminute = date.getMinutes();
	var nowhour = date.getHours();
	var nowday = date.getDay(); // 주의 : 일이아니라 요일
	var nowyear = date.getFullYear()
	var nowmonth = date.getMonth()+1
	var nowdate = date.getDate()

	var currentTime = new Date().valueOf() // 현재 시간 1ms단위


	if(nowmonth.toString().length==1){
		var nowmonth0 = "0"+nowmonth
	}
	else{
		var nowmonth0 = nowmonth
	}
	if(nowdate.toString().length==1){
		var nowdate0 = "0"+nowdate
	}
	else{
		var nowdate0 = nowdate
	}

	/*
   var nowmonth0 = (date.getMonth()+1).plus0()
   var nowdate0 = date.getDate().plus0()
   */

	//확률변수
	for(i=0;i<12;i++){
		if(i==0){var Rand2 = Math.floor(Math.random() *2 );}
		if(i==1){var Rand3 = Math.floor(Math.random() *3 );}
		if(i==2){var Rand4 = Math.floor(Math.random() *4 );}
		if(i==3){var Rand5 = Math.floor(Math.random() *5 );}
		if(i==4){var Rand10 = Math.floor(Math.random() *10 );}
		if(i==5){var Rand20 = Math.floor(Math.random() *20 );}
		if(i==6){var Rand30 = Math.floor(Math.random() *30 );}
		if(i==7){var Randcat = Math.floor(Math.random() *31 );}
		if(i==8){var Randu = Math.floor(Math.random() *6 );}
		if(i==9){var Rand5000 = Math.floor(Math.random() *5000 );}
		if(i==10){var Rand10000 = Math.floor(Math.random() *10000 );}
		if(i==11){var Rand16 = Math.floor(Math.random() * 16 );}
	}

	try{
		sender = sender.replace(String.fromCharCode(8238),"") // RLO 방지
		msg = msg.replace(String.fromCharCode(8238),"") // RLO 방지
		var msgD = msg.replace(/ /g,'') //

		// TEST 코드
		if(msg=="TEST") {
			r.reply("TEST");
		}

		/*

	if(k<2){k++;}
	else{k=0;}
	setDB("temp_msg_"+k,msg)
	if(strcmp(getDB("temp_msg_0"),getDB("temp_msg_1"))==0&&strcmp(getDB("temp_msg_0"),getDB("temp_msg_2"))==0&&strcmp(getDB("temp_msg_1"),getDB("temp_msg_2"))==0){
		r.reply(msg)
		k=0
		setDB("temp_msg_0","")
		setDB("temp_msg_1","")
		setDB("temp_msg_2","")
	}

	*/

		if(Api.getRoomList().length!=getNum("roomNumber")){ // 방 정보 입력
			setDB("roomNumber",Api.getRoomList().length)
			roomList  = Api.getRoomList().join("\n")
		}

		// eval 활성화코드 (비상 정지시에도 eval은 활성화)
		if(msg.indexOf(">")==0&&(room=="봇장난"||room=="노은총")&&evalON==0){
			//replier.reply(eval(msg).toString().encoding())
			replier.reply(">"+new String(eval(msg.substring(1))).encoding());
		}
		if(msg.indexOf(">")==0&&evalON==1) {
			replier.reply(">"+new String(eval(msg.substring(1))).encoding());
			// replier.reply(">"+new String(eval(msg.substring(1))));
		}
		if(sender=="슈발베"&&NECevalON==1&&room=="시갤톡방"){
			replier.reply(">"+new String(eval(msg.substring(1))).encoding());
		}

		// eval ON코드
		if((room=="봇장난"||room=="노은총")&&msg=="eval ON"){
			evalON=1;
			Api.replyRoom("노은총","eval 활성화 완료")
			Api.replyRoom("봇장난","eval 활성화 완료")
		}
		// eval OFF코드
		if((room=="봇장난"||room=="노은총")&&msg=="eval OFF"){
			evalON=0;
			Api.replyRoom("노은총","eval 비활성화 완료")
			Api.replyRoom("봇장난","eval 비활성화 완료")
		}

		//answer
		var it = AnswerSet.keySet().iterator()
		while(it.hasNext()){
			key = it.next()
			AnswerSet.get(key).put(r)
		}
		// blank function
		blankFunc(r)

		// blank function
		blankFunc1(r)

		// blank function
		blankFunc2(r)

		// blank function
		blankFunc3(r)

		// blank function
		blankFunc4(r)

		// blank function
		blankFunc5(r)

		setChatDB(sender,room)

		// 메세지 전달코드
		if(msg.indexOf("/s ")==0&&room=="봇장난"){
			Api.replyRoom("시갤톡방",msg.substring(3))
		}
		if(msg.indexOf("/q ")==0&&room=="봇장난"){
			Api.replyRoom("퀴푸 사담방",msg.substring(3))
		}
		if(msg.indexOf("/g ")==0&&room=="봇장난"){
			Api.replyRoom("그누톡방",msg.substring(3))
		}
		if(msg.indexOf("/e ")==0&&room=="봇장난"){
			Api.replyRoom("전전컴아싸방",msg.substring(3))
		}
		if(msg.indexOf("/u ")==0&&room=="봇장난"){
			Api.replykoRoom("서울시립대학교",msg.substring(3))
		}
		if(msg.indexOf("/z ")==0&&room=="봇장난"){
			Api.replyRoom("시립대자취생생정",msg.substring(3))
		}



//=====================================================================================================================================
//================================================    커맨드    =====================================================================
//=====================================================================================================================================

		// 라비찬스
		if( msg.indexOf("라비")>-1 && msg.indexOf("찬스")>-1 ){
			setDB("LabyChance_"+sender,"1")
			setDB("LabyChanceSub_"+sender,15)
		}
		else if(getNum("LabyChanceSub_"+sender)>0){
			setDB("LabyChanceSub_"+sender,getNum("LabyChanceSub_"+sender)-1)
		}
		else{
			setDB("LabyChance_"+sender,"0")
		}


		if(room=="봇장난"&&msg=="/커맨드"){
			var str_command = "";
			str_command += "1.메세지전달\n"
			str_command += "2.밴항의방\n"
			str_command += "3.격리방\n"
			str_command += "4.공갤파싱"
			r.reply(str_command)
		}

		else if(room=="봇장난"&&msg=="/커맨드 메세지전달"){
			var str_command = "";
			str_command += "/s : 시갤톡방\n"
			str_command += "/q : 퀴푸톡방\n"
			str_command += "/g : 그누톡방\n"
			str_command += "/e : 전전컴아싸방\n"
			str_command += "/z : 시립대생정방"
			r.reply(str_command)
		}



		else if(room=="봇장난"&&msg=="/커맨드 공갤파싱"){
			var str_command = "";
			str_command += "====== DB ======\n"
			str_command += "DCP_max : "+getDB("DCP_max")+"\n"
			str_command += "DC_title_[number] : "+getDB("DC_title_"+getDB("DCP_max"))+"\n"
			str_command += "DC_writer_[number] : "+getDB("DC_writer_"+getDB("DCP_max"))+"\n"
			str_command += "================"
			r.reply(str_command)
		}




//=====================================================================================================================================
//================================================    커맨드    =====================================================================
//=====================================================================================================================================

		if(sender=="업무전용"){
			autostr(msg)
		}

		if(room=="엘벤져스 제 [10]기"){
			Api.replyRoom("도청방2", sender+":"+msg)
		}

		if(msg=="/sender"){
			r.reply(sender)
		}
		if(msg=="/room"){
			r.reply(room)
		}

//=====================================================================================================================================
//==============================================    기능    ============================================================================
//=====================================================================================================================================

		//건의
		if(msg.indexOf("/건의")==0){
			Api.replyRoom("봇메시지함","@건의내용 : "+msg.substring(3)+" ("+room+"톡방 건의자 : "+sender+")")
			Api.replyRoom("봇장난","@건의내용 : "+msg.substring(3)+" ("+room+"톡방 건의자 : "+sender+")")
			r.reply("건의가 접수되었습니다.")
		}



		//기능
		if(r.m=="/기능"&&room=="전전컴아싸방"){
			var funstr = ""
			funstr += "/건물번호\n"
			funstr += "/과사번호\n"
			funstr += "/번역기\n"
			funstr += "/자동번역\n"
			//funstr += "/시간채팅량\n"
			//funstr += "/일일채팅량\n"
			funstr += "/실크로드\n"
			funstr += "/시간표검색\n"
			funstr += "/시간표상세검색\n"
			funstr += "/일반공지확인\n"
			funstr += "/학사공지확인\n"
			funstr += "/전전컴공지확인\n"
			funstr += "/경영공지확인\n"
			funstr += "/롤\n"
			funstr += "/전철\n"
			funstr += "===========\n"
			funstr += "공지사항\n"
			funstr += "공지확인방\n"
			funstr += "관리자문의\n"
			funstr += "=전전컴방전용기능=\n"
			funstr += "/포인트확인\n"
			funstr += "/포인트목록\n"
			funstr += "/부방장복권"
			//funstr += "==테스트기능==\n"
			//funstr += "영단어학습"

			replier.reply(funstr)
			replier.reply("더 자세한 정보를 원하시면 /기능 뒤에 해당 명령어를 입력하세요\nex) /기능 건물번호, /기능 번역기")
		}
		else if(r.m=="/기능"&&room!="공지확인방"&&isGroupChat==true&&room!="시갤톡방"){
			var funstr = ""
			funstr += "=== 주요기능 ===\n"
			funstr += "/시간표검색\n"
			funstr += "/일반공지확인\n"
			funstr += "/중도\n"
			funstr += "=============\n"
			funstr += "더 자세한 정보를 원하시면 /기능 뒤에 해당 명령어를 입력하세요\n" +
				"ex) /기능 학식, /기능 vs \n\n"
			funstr += "이 외의 기능은 전체보기를 눌러주세요.‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭‭...\n\n"

			funstr += "/건물번호\n"
			funstr += "/과사번호\n"
			funstr += "/번역기\n"
			funstr += "/자동번역\n"
			//funstr += "/시간채팅량\n"
			//funstr += "/일일채팅량\n"
			//funstr += "/실크로드\n"
			funstr += "/시간표검색\n"
			funstr += "/시간표상세검색\n"
			funstr += "/일반공지확인\n"
			funstr += "/학사공지확인\n"
			funstr += "/전전컴공지확인\n"
			funstr += "/경영공지확인\n"
			//funstr += "/롤\n"
			funstr += "/전철\n"
			funstr += "===========\n"
			//funstr += "공지사항\n"
			funstr += "공지확인방\n"
			funstr += "관리자문의"
			//funstr += "==테스트기능==\n"
			//funstr += "영단어학습"

			replier.reply(funstr.cut(11))
			//replier.reply("더 자세한 정보를 원하시면 /기능 뒤에 해당 명령어를 입력하세요\nex) /기능 건물번호, /기능 번역기")
		}

		else if(r.m=="/기능"&&room!="공지확인방"&&isGroupChat==true&&room!="시갤톡방"){
			var funstr = ""
			funstr += "/건물번호\n"
			funstr += "/번역기\n"
			funstr += "/자동번역\n"
			//funstr += "/시간채팅량\n"
			//funstr += "/일일채팅량\n"
			funstr += "/실크로드\n"
			funstr += "/시간표검색\n"
			funstr += "/시간표상세검색\n"
			funstr += "/일반공지확인\n"
			funstr += "/학사공지확인\n"
			funstr += "/전전컴공지확인\n"
			funstr += "/경영공지확인\n"
			funstr += "/전철\n"
			funstr += "===========\n"
			funstr += "공지사항\n"
			funstr += "공지확인방\n"
			funstr += "관리자문의"
			//funstr += "==테스트기능==\n"
			//funstr += "영단어학습"

			replier.reply(funstr)
			replier.reply("더 자세한 정보를 원하시면 /기능 뒤에 해당 명령어를 입력하세요\nex) /기능 건물번호, /기능 번역기")
		}

		else if(r.m=="/기능"&&room!="공지확인방"&&isGroupChat==true&&room=="시갤톡방"){ // 시갤톡방 전용 기능
			var funstr = ""
			funstr += "/건물번호\n"
			funstr += "/번역기\n"
			funstr += "/자동번역\n"
			//funstr += "/시간채팅량\n"
			//funstr += "/일일채팅량\n"
			funstr += "/실크로드\n"
			funstr += "/시간표검색\n"
			funstr += "/시간표상세검색\n"
			funstr += "/일반공지확인\n"
			funstr += "/전전컴공지확인\n"
			funstr += "/학사공지확인\n"
			funstr += "/전철\n"
			funstr += "===========\n"
			funstr += "공지사항\n"
			funstr += "공지확인방\n"
			funstr += "관리자문의\n"
			//funstr += "==테스트기능==\n"
			//funstr += "영단어학습"
			funstr += "===========\n"
			funstr += "포인트확인\n"
			//funstr += "/고꿈셔터 (10포인트)(3분)\n"
			//funstr += "/고꿈포인트기부 [숫자] [보낼메시지]\n"
			//funstr += "/고꿈대출포인트주기 [숫자] [보낼메시지]\n"
			//funstr += "/고꿈포인트착취 [숫자] [보낼메시지]\n"
			funstr += "/채팅추적 [숫자] [추적할닉네임]\n"
			funstr += "/부방장복권 [숫자]"
			//funstr += "/메세지알림 [hh:mm:ss] [메시지]"

			replier.reply(funstr)
			replier.reply("더 자세한 정보를 원하시면 /기능 뒤에 해당 명령어를 입력하세요\nex) /기능 건물번호, /기능 번역기")
		}
		else if(r.m=="/기능"&&room!="공지확인방"&&isGroupChat==false){ // 개인톡 공지 확인
			var funstr = ""
			funstr += "/학식\n"
			funstr += "/건물번호\n"
			funstr += "/과사번호\n"
			funstr += "/번역기\n"
			funstr += "/자동번역\n"
			//funstr += "/시간채팅량\n"
			//funstr += "/일일채팅량\n"
			funstr += "/시간표검색\n"
			funstr += "/시간표상세검색\n"
			funstr += "/일반공지확인\n"
			funstr += "/학사공지확인\n"
			funstr += "/전전컴공지확인\n"
			funstr += "/경영공지확인\n"
			funstr += "/중도\n"
			funstr += "/전철\n"
			funstr += "===========\n"
			funstr += "공지사항\n"
			funstr += "공지확인방\n"
			funstr += "관리자문의"
			//funstr += "==테스트기능==\n"
			//funstr += "영단어학습"

			replier.reply(funstr)
			replier.reply("더 자세한 정보를 원하시면 /기능 뒤에 해당 명령어를 입력하세요\nex) /기능 건물번호, /기능 번역기")
		}
		else if(r.m=="/기능"&&room=="공지확인방"){
			r.reply("공지확인방에서는 지원하지 않는 기능입니다.")
		}
		//if(r.m=="/기능 꿈나무카운터"){
		//   replier.reply("'/꿈나무카운터'를 입력하면 꿈나무가 쓸데없이 하루동안 몇마디를 했는지 보여줍니다.\n말을 너무 많이하면 봇이 자동으로 경고메세지를 출력합니다.\n매일 자정 초기화됩니다.")
		//}
		if(r.m=="/기능 건물번호"){
			replier.reply("건물번호를 볼 수 있습니다.\nex> /건물번호 3")
		}
		if(r.m=="/기능 번역기"){
			replier.reply("텍스트를 다른 언어로 번역해줍니다.\nex>한국어 '안녕'을 일본어로 번역하고 싶은 경우 '/한일 안녕'\n지원 언어 : 한국어(한), 영어(영), 일본어(일), 중국어(중), 아랍어(아) 프랑스어(프), 독일어(독), 러시아어(러), 이탈리아어(이), 스페인어(스), 스웨덴어(웨), 힌디어(힌), 벵골어(벵), 몽골어(몽), 인도네시아어(인), 베트남어(베), 태국어(태), 라틴어(라)\n추가지원을 원하는 언어가 있으실 경우 '/건의'기능을 이용해주세요.")
		}
		if(r.m=="/기능 자동번역"){
			replier.reply("번역 명령어 없이 대상의 말을 자동으로 번역해줍니다.\n활성화 방법 : /자동번역 [번역대상언어][번역결과언어]\n비활성화방법 : /자동번역 OFF\nex> 한국어를 일본어로 자동번역하고싶은경우 '/자동번역 한일'\n지원 언어 : 한국어(한), 영어(영), 일본어(일), 중국어(중), 아랍어(아) 프랑스어(프), 독일어(독), 러시아어(러), 이탈리아어(이), 스페인어(스), 힌디어(힌), 벵골어(벵), 몽골어(몽), 인도네시아어(인), 베트남어(베), 태국어(태), 라틴어(라)\n추가지원을 원하는 언어가 있으실 경우 '/건의'기능을 이용해주세요.")
		}
		if(r.m=="/기능 시간채팅량"){
			replier.reply("지난 시간 정각부터 명령어를 호출한 시간까지 해당 방에서 대화한 횟수를 보여줍니다.")
		}
		if(r.m=="/기능 일일채팅량"){
			replier.reply("당일 자정부터 명령어를 호출한 시간까지 해당 방에서 대화한 횟수를 보여줍니다.")
		}
		if(r.m=="/기능 실크로드"){
			replier.reply("결정장애인 여러분을 위해 똑똑한 시립봇이 뭘 마실지 대신 정해줍니다.\nex> /실크로드, /실크로드 Margarita, /실크로드 마티니")
		}
		if(r.m=="/기능 시간표검색"||r.m=="/기능 시간표"){
			replier.reply("2019년 1학기 강의 시간표를 검색 가능합니다. 교수님 성함으로도 검색이 가능합니다.\n" +
				"ex> /시간표검색 공학수학1, /시간표검색 고전물, /시간표검색 이승환\n" +
				"/시간표상세검색 [번호]를 이용하여 상세정보를 볼 수 있습니다. 자세한 내용은 '/기능 시간표상세검색'으로 확인해주세요.")
		}
		if(r.m=="/기능 시간표상세검색"){
			r.reply("먼저 시간표검색기능으로 해당 과목이나 교수님을 찾으시고 해당하는 번호를 입력하시면 상세정보를 볼 수 있습니다.\nex>/시간표상세검색 3")
		}
		if(r.m=="/기능 일반공지확인"){
			replier.reply("포탈의 최근 일반공지를 확인 할 수 있습니다.")
		}
		if(r.m=="/기능 학사공지확인"){
			replier.reply("포탈의 최근 학사공지를 확인 할 수 .")
		}
		if(r.m=="/기능 전전컴공지확인"){
			replier.reply("전전컴 학부 최근 공지를 확인 할 수 있습니다.")
		}
		if(r.m=="/기능 전전컴공지확인"){
			replier.reply("경영학부 최근 공지를 확인 할 수 있습니다.")
		}
		if(r.m=="/기능 롤"){
			replier.reply("롤 티어 및 최근 전적을 확인 할 수 있습니다.\nex> /롤 [닉네임], /롤티어 [닉네임], /롤전적 [닉네임], /ㄹ [닉네임]")
		}
		if(r.m=="/기능 전철"){
			replier.reply("전철의 실시간 도착 정보를 확인 할 수 있습니다.\nex> /전철 [역명], /지하철 [역명]\n일부 역이나 일부 노선은 지원하지 않을 수 있습니다.\n실시간 정보를 받아오는 서버 상태가 좋지 않으니 데이터가 이상할경우 잠시 후 다시 시도해주시기 바랍니다.")
		}
		if(r.m=="/기능 공지사항"||r.m=="/공지사항"){
			replier.reply(getDB("Notice"))
		}
		if(r.m=="/기능 관리자문의"||r.m=="/관리자문의"){
			replier.reply("관리자에게 1:1 문의를 할 수 있는 오픈톡방입니다.")
			r.reply("https://open.kakao.com/o/sIPdVE9")
		}
		if(r.m=="/기능 공지확인방"||r.m=="/공지확인방"){
			replier.reply("학교에 공지가 새로 게시되면 이를 시립봇으로 알려주는 오픈카톡방입니다.\n이 방에서 대화는 자제해주시고 문의가 필요한 경우 /건의 기능을 이용해주세요.")
			r.reply("https://open.kakao.com/o/gl9B7dZ")
		}
		if(r.m=="/기능 학식"&&isGroupChat==false){
			replier.reply("오늘의 학교 식단이 뭐가 나오는지 확인할 수 있습니다.")
		}
		//if(r.m=="/기능 영단어학습"||r.m=="/영단어학습"){
		//r.reply("영어단어를 학습 할 수 있는 미완성 기능입니다. 외우지 못한 단어수는 높은 빈도수로 출현하고 외운 단어는 낮은 빈도수로 출현합니다.")
		//r.reply("(초기설정)/영어단어학습프로필생성 [원하는닉네임]을 입력하여 초기설정을 해주어야합니다. ([]는 입력 안해도 됨)")
		//r.reply("(학습시작)/영어단어학습시작 [지정한닉네임]을 이용하여 영어단어 학습을 시작 할 수 있습니다.")
		//r.reply("(학습종료)종료시엔 반드시 '/영어단어학습종료'를 입력해주세요")

		//}
		if(r.m=="/기능 포인트확인"&&room=="전전컴아싸방"){
			replier.reply("현재 포인트 보유량을 확인할 수 있습니다.")
		}
		if(r.m=="/기능 포인트목록"&&room=="전전컴아싸방"){
			replier.reply("최근에 포인트를 획득한 사람들의 포인트 목록을 볼 수 있습니다. 10포인트를 소모합니다.")
		}
		if(r.m=="/기능 부방장복권"&&room=="전전컴아싸방"){
			replier.reply("일정 확률로 당첨되는 부방장 응모권을 구매 할 수 있습니다.\n/부방장복권 [숫자]로 여러장을 구매할 수 있으며 한 장에 10포인트를 소모합니다.")
		}
		if(r.m=="/기능 과사번호"||msg=="/과사번호"){
			replier.reply("과사 전화번호를 알려주는 기능입니다.\n명령어 : /과사번호 [과이름]\nex>/과사번호 전전컴")
		}



//===================================================================================================================================

		if(msg=="/건물번호"){
			r.reply("검색하실 건물번호를 입력해주세요.\n'/기능 건물번호'를 입력하여 메뉴얼을 읽어주세요")
		}

		//건물번호
		else if(msg.indexOf("/건물번호")!=-1){
			if(msg.substring(6)=="1"||msg.substring(6).I("전농관")){replier.reply("1.전농관")}
			if(msg.substring(6)=="2"||msg.substring(6).I("1공학관")){replier.reply("2.제 1공학관")}
			if(msg.substring(6)=="3"||msg.substring(6).I("건공관")||msg.substring(6).I("건설공학관")){replier.reply("3.건설공학관")}
			if(msg.substring(6)=="4"||msg.substring(6).I("창공관")){replier.reply("4.창공관")}
			if(msg.substring(6)=="5"||msg.substring(6).I("인문학관")||msg.substring(6).I("인문관")){replier.reply("5.인문학관")}
			if(msg.substring(6)=="6"||msg.substring(6).I("배봉관")){replier.reply("6.배봉관")}
			if(msg.substring(6)=="7"||msg.substring(6).I("대학본부")||msg.substring(6).I("본부")){replier.reply("7.대학본부")}
			if(msg.substring(6)=="8"||msg.substring(6).I("자과관")||msg.substring(6).I("자연과학관")){replier.reply("8.자연과학관")}
			if(msg.substring(6)=="9"||msg.substring(6).I("음악관")){replier.reply("9.음악관")}
			if(msg.substring(6)=="10"||msg.substring(6).I("경농관")){replier.reply("10.경농관")}
			if(msg.substring(6)=="11"||msg.substring(6).I("2공학관")){replier.reply("11.제 2공학관")}
			if(msg.substring(6)=="12"||msg.substring(6).I("학생회관")||msg.substring(6).I("학관")){replier.reply("12.학생회관")}
			if(msg.substring(6)=="13"||msg.substring(6).I("학군단")){replier.reply("13.학군단")}
			if(msg.substring(6)=="14"||msg.substring(6).I("과학기술관")||msg.substring(6).I("과기관")){replier.reply("14.과학기술관")}
			if(msg.substring(6)=="15"||msg.substring(6).I("21세기관")){replier.reply("15.21세기관")}
			if(msg.substring(6)=="16"||msg.substring(6).I("조형관")){replier.reply("16.조형관")}
			if(msg.substring(6)=="17"||msg.substring(6).I("100주년")||msg.substring(6).I("시민문화")){replier.reply("17.시민문화교육관")}
			if(msg.substring(6)=="18"||msg.substring(6).I("자작마루")){replier.reply("18.자작마루")}
			if(msg.substring(6)=="19"||msg.substring(6).I("정보기술관")||msg.substring(6).I("정기관")){replier.reply("19.정보기술관")}
			if(msg.substring(6)=="20"||msg.substring(6).I("법학관")){replier.reply("20.법학관")}
			if(msg.substring(6)=="21"||msg.substring(6).I("중도")||msg.substring(6).I("중앙도서관")){replier.reply("21.중앙도서관")}
			if(msg.substring(6)=="22"||msg.substring(6).I("생활관")||msg.substring(6).I("기숙사")){replier.reply("22.생활관")}
			if(msg.substring(6)=="23"){replier.reply("23.건축구조실험동")}
			if(msg.substring(6)=="24"){replier.reply("24.토목구조실험동")}
			if(msg.substring(6)=="25"||msg.substring(6).I("미디어관")){replier.reply("25.미디어관")}
			if(msg.substring(6)=="26"){replier.reply("26.자동화온실")}
			if(msg.substring(6)=="27"||msg.substring(6).I("강당")){replier.reply("27.대강당")}
			if(msg.substring(6)=="28"){replier.reply("28.운동장")}
			if(msg.substring(6)=="29"){replier.reply("29.박물관")}
			if(msg.substring(6)=="30"||msg.substring(6).I("정문")){replier.reply("30.정문")}
			if(msg.substring(6)=="31"||msg.substring(6).I("후문")){replier.reply("31.후문")}
			if(msg.substring(6)=="32"||msg.substring(6).I("웰니스")){replier.reply("32.웰니스센터")}
			if(msg.substring(6)=="33"||msg.substring(6).I("미래관")){replier.reply("33.미래관")}
			if(msg.substring(6)=="34"||msg.substring(6).I("국제학사")||msg.substring(6).I("기숙사")){replier.reply("34.국제학사")}
			if(msg.substring(6)=="35"||msg.substring(6).I("배봉탕")||msg.substring(6).I("하늘못")){replier.reply("35.하늘못")}
			if(msg.substring(6)=="36"){replier.reply("36.어린이집")}
			if(msg.substring(6)=="37"||msg.substring(6).I("100주년")||msg.substring(6).I("시민문화")){replier.reply("37.시민문화교육관")}
		}

//===================================================================================================================================



		if(room=="공지확인방"){
		}
		else if(msg.indexOf("/시간채팅량")==0){
			var time_hour_chat_people = "" // 검색할 사람 이름
			if(msg=="/시간채팅량"){time_hour_chat_people=sender}
			else{time_hour_chat_people=msg.substring(7)}

			var time_hour_chat_num_sum = sumDB(room,"hour") // 1시간동안 전체 채팅량
			var time_hour_chat_num_max = searchMaxDB(room,"hour").split("||")[1] // 1시간동안 최대 채팅량
			var time_hour_chat_num_max_who = searchMaxDB(room,"hour").split("||")[0] // 1시간동안 최대 채팅자
			var time_hour_chat_num = D.selectForArray("chatTable","hourChat","sender like ? and room like ?",[sender,room]) // 요청한사람의 시간 채팅량

			if(nowminute>9){
				r.reply(nowhour+":00~"+nowhour+":"+nowminute+"동안 톡방 전체 채팅량 : "+time_hour_chat_num_sum+"회")
				r.reply(nowhour+":00~"+nowhour+":"+nowminute+"동안 최고의 TMI : "+time_hour_chat_num_max_who+" ("+time_hour_chat_num_max+"회)")
				r.reply(nowhour+":00~"+nowhour+":"+nowminute+"동안 "+time_hour_chat_people+"의 대화횟수 : "+time_hour_chat_num+"회")
			}
			else if(nowminute<10){
				r.reply(nowhour+":00~"+nowhour+":0"+nowminute+"동안 톡방 전체 채팅량 : "+time_hour_chat_num_sum+"회")
				r.reply(nowhour+":00~"+nowhour+":0"+nowminute+"동안 최고의 TMI : "+time_hour_chat_num_max_who+" ("+time_hour_chat_num_max+"회)")
				r.reply(nowhour+":00~"+nowhour+":0"+nowminute+"동안 "+time_hour_chat_people+"의 대화횟수 : "+time_hour_chat_num+"회")
			}
		}

//===================================================================================================================================

		if(room=="공지확인방"){
		}
		else if(msg.indexOf("/일일채팅량")==0){
			var time_day_chat_people = "" // 검색할 사람 이름
			if(msg=="/일일채팅량"){time_day_chat_people=sender}
			else{time_day_chat_people=msg.substring(7)}

			var time_day_chat_num_sum = sumDB(room,"day") // 1일동안 전체 채팅량
			var time_day_chat_num_max = searchMaxDB(room,"day").split("||")[1] // 1일동안 최대 채팅량
			var time_day_chat_num_max_who = searchMaxDB(room,"day").split("||")[0] // 1일동안 최대 채팅자
			var time_day_chat_num = D.selectForArray("chatTable","dayChat","sender like ? and room like ?",[sender,room]) // 요청한사람의 1일 채팅량

			if(nowminute>9){
				r.reply("00:00~"+nowhour+":"+nowminute+"동안 톡방 전체 채팅량 : "+time_day_chat_num_sum+"회")
				r.reply("00:00~"+nowhour+":"+nowminute+"동안 최고의 TMI : "+time_day_chat_num_max_who+" ("+time_day_chat_num_max+"회)")
				r.reply("00:00~"+nowhour+":"+nowminute+"동안 "+time_day_chat_people+"의 대화횟수 : "+time_day_chat_num+"회")
			}
			else if(nowminute<10){
				r.reply("00:00~"+nowhour+":0"+nowminute+"동안 톡방 전체 채팅량 : "+time_day_chat_num_sum+"회")
				r.reply("00:00~"+nowhour+":0"+nowminute+"동안 최고의 TMI : "+time_day_chat_num_max_who+" ("+time_day_chat_num_max+"회)")
				r.reply("00:00~"+nowhour+":0"+nowminute+"동안 "+time_day_chat_people+"의 대화횟수 : "+time_day_chat_num+"회")
			}
		}


//===================================================================================================================================


		if(room=="공지확인방"){
		}
		else if(msg=="/실크로드"||msg=="/실크로드 아무거나"){
			r.reply("시립봇의 추천메뉴는 '"+
				randReply("코코넛 ㅇㄱㄹㅇ_커피","코코넛 ㅂㅂㅂㄱ_딸기★","떡전교 붉은 장미★","나 잡아봐라~~~메론★","리얼 틈메이러"

					,"마티니","애플 마티니","초코 마티니","체리 마티니","비키니 마티니"

					,"애플 다이퀴리","바나나 다이퀴리","망고 다이퀴리","블루베리 다이퀴리","라즈베리 다이퀴리","스트로베리 다이퀴리"

					,"라즈베리 샹그리아","벨리니","스트로베리 샹그리아","샹그리아 블랑카","위스키콕","피나코라다★","카시스펀치","봉주르 카페봉봉★"
					,"술취한 애플파이★","발리에서 마신일★","#술스타크램#핑크","왕년에 씹던 코코파인★","설렘 주의보★","옥보단★","+삐뽀삐뽀+★"
					,"동남아를 털어 마셔★","제주도 푸른밤★","진토닉","석촌호수★","골드메달리스트★","오르가즘","민트쥴렙","별들이 소근대는 하와이 밤바다★"
					,"봉봉인가봉가★","나 지금 궁서체다★","성산일출봉에서★","별이 빛나는 밤에★"

					,"스트로베리 모히토★","라임 모히토★","애플 모히토★","체리 모히토★","망고 모히토★","블루베리 모히토★","청포도 모히토★"

					,"넉다운","압생트 B-55","압생트 밤","오후의 죽음","핑크레이디★"
					,"生生한 딸기 소녀 (feat.카카오)★","生生한 바나나군 (feat.카카오)★","망고 한사발★"
					,"블루사파이어","개새콤핵상콤★","깔루아밀크","주문은 내가 계산은 니가★"
					,"사과나무에 포도열렸네","친구의 친구를 사랑했네★"
					,"피치크러쉬★","이런 수박 새끼★","데킬라썬라이즈","미스 알로하★","티칵미수","화이트러시안","파인 알딸딸★","손만 잡고 마실께"

					,"예거밤","예거토닉","예거피즈","저승행 특급열차"

					,"마가리타","블루 마가리타","애플 마가리타","블루베리 마가리타","라즈베리 마가리타","물 반 고기 반★","그 새끼보다 내가 못한게 뭐야★","이 밤 다 가도록★"
					,"파우스트","신데렐라","그래스호퍼","코스모폴리탄","준벅","섹스온더비치","그린 라이트","마이타이★","내가 진짜 자몽이다★","엔젤키스"
					,"피치코코★","미도리샤워","구름송송 달콤퐁퐁★","위스키","바카디","레몬드랍","블랙러시안","집에전화했어","꼬R라는 선택 음주는 필수","BMW(Baileys+Malibu+Whisky)"
					,"아브라카타브라","B52","데킬라","체리블러섬","내가 많이 취해서","카타르시스","롱아일랜드아이스티","좀비","메시루니호날두","배봉산 노을"
					,"내가니애미다","내가니애비다","카미카제","대.다.나.다","전화기가 꺼져있어","잠자는 숲속의 공주","정.줄.놓","정글주스"

				)+"'입니다.");
		}
		else if (msg=="/실크로드 SSㅅㅅㅁㄴ"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("코코넛 ㅇㄱㄹㅇ_커피","코코넛 ㅂㅂㅂㄱ_딸기★","떡전교 붉은 장미★","나 잡아봐라~~~메론★","리얼 틈메이러")+"'입니다.")
		}
		else if (msg=="/실크로드 마티니"||msg=="/실크로드 Martini"||msg=="/실크로드 martini"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("마티니","애플 마티니","초코 마티니","체리 마티니","비키니 마티니")+"'입니다.")
		}
		else if (msg=="/실크로드 다이퀴리"||msg=="/실크로드 Daiquiri"||msg=="/실크로드 daiquiri"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("애플 다이퀴리","바나나 다이퀴리","망고 다이퀴리","블루베리 다이퀴리","라즈베리 다이퀴리","스트로베리 다이퀴리")+"'입니다.")
		}
		else if (msg=="/실크로드 샹그리아"||msg=="/실크로드 상그리아"||msg=="/실크로드 Sangria"||msg=="/실크로드 sangria"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("라즈베리 샹그리아","벨리니","스트로베리 샹그리아","샹그리아 블랑카","위스키콕","피나코라다★","카시스펀치","봉주르 카페봉봉★"
				,"술취한 애플파이★","발리에서 마신일★","#술스타크램#핑크","왕년에 씹던 코코파인★","설렘 주의보★","옥보단★","+삐뽀삐뽀+★"
				,"동남아를 털어 마셔★","제주도 푸른밤★","진토닉","석촌호수★","골드메달리스트★","오르가즘","민트쥴렙","별들이 소근대는 하와이 밤바다★"
				,"봉봉인가봉가★","나 지금 궁서체다★","성산일출봉에서★","별이 빛나는 밤에★")+"'입니다.")
		}
		else if (msg=="/실크로드 모히토"||msg=="/실크로드 모히또"||msg=="/실크로드 Mojito"||msg=="/실크로드 mojito"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("스트로베리 모히토★","라임 모히토★","애플 모히토★","체리 모히토★","망고 모히토★","블루베리 모히토★","청포도 모히토★")+"'입니다.")
		}
		else if (msg=="/실크로드 압생트"||msg=="/실크로드 압쌩트"||msg=="/실크로드 Absinthe"||msg=="/실크로드 absinthe"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("넉다운","압생트 B-55","압생트 밤","오후의 죽음","핑크레이디★","生生한 딸기 소녀 (feat.카카오)★","生生한 바나나군 (feat.카카오)★","주문은 내가 계산은 니가★"
				,"망고 한사발★","깔루아밀크","블루사파이어","손만 잡고 마실께","개새콤핵상콤★","사과나무에 포도열렸네","친구의 친구를 사랑했네★"
				,"피치크러쉬★","이런 수박 새끼★","데킬라썬라이즈","미스 알로하★","티칵미수","화이트러시안","파인 알딸딸★")+"'입니다.")
		}
		else if (msg=="/실크로드 예거마이스터"||msg=="/실크로드 예거"||msg=="/실크로드 Jager Meister"||msg=="/실크로드 jager meister"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("예거밤","예거토닉","예거피즈","저승행 특급열차")+"'입니다.")
		}
		else if (msg=="/실크로드 마가리타"||msg=="/실크로드 Margarita"||msg=="/실크로드 margarita"){
			r.reply("시립봇의 추천메뉴는 '"+randReply("마가리타","블루 마가리타","애플 마가리타","블루베리 마가리타","라즈베리 마가리타","물 반 고기 반★","그 새끼보다 내가 못한게 뭐야★","이 밤 다 가도록★"
				,"파우스트","신데렐라","그래스호퍼","코스모폴리탄","준벅","섹스온더비치","그린 라이트","마이타이★","내가 진짜 자몽이다★","엔젤키스"
				,"피치코코★","미도리샤워","구름송송 달콤퐁퐁★","위스키","바카디","레몬드랍","블랙러시안","집에전화했어","꼬R라는 선택 음주는 필수","BMW(Baileys+Malibu+Whisky)"
				,"아브라카타브라","B52","데킬라","체리블러섬","내가 많이 취해서","카타르시스","롱아일랜드아이스티","좀비","메시루니호날두","배봉산 노을"
				,"내가니애미다","내가니애비다","카미카제","대.다.나.다","전화기가 꺼져있어","잠자는 숲속의 공주","정.줄.놓","정글주스")+"'입니다.")
		}



//=============================================================================================================================================

		if(msg=="웅앙맨테스트"){
			r.reply("웅앙맨테스트완료")
		}

		if(msg.indexOf("/시간표검색")==0){
			var year = ""
			var term = ""
			var search_nm = ""
			if(msg.split(" ")[1].search(/\d\d\d\d/)==0){ // 다른년도 검색 활성화
				year = String(msg.split(" ")[1])
				search_nm = String(msg.split(" ").slice(2,msg.split(" ").length))
			}
			else{
				year = "2020"
				term = "A20"
				search_nm = String(msg.split(" ").slice(1,msg.split(" ").length))
			}
			/*
		2017_A20_40135_25||2017||A20||전공필수||전공필수||25||40135||학업설계상담 Ⅱ||전자전기컴퓨터공학부||주간||1||0||||이승환||||6||5
		2017_A20_40140_01||2017||A20||전공선택||전공선택||01||40140||기초전력전자공학||전자전기컴퓨터공학부||주간||4||3||목02,03/19-B108, 금02/19-B108||이승환||||55||25
		*/
			var UOSTimeDBSearchResult = UOS_Time_DB_search(search_nm,year,term)
			var UOSTimeNum = Number( UOSTimeDBSearchResult.split("\n").length ) // 데이터 없어도 기본 1임에 주의

			var search_str = ""
			var search_nm = "" // 검색결과가 몇번 DB인지를 임시 저장
			var search_split = ""

			if(UOSTimeNum == 1){
				r.reply("검색결과가 없습니다.")
				Api.replyRoom("봇장난",msg)
			}
			else{
				for(var i=0;i<UOSTimeNum-1;i++){
					search_split = UOSTimeDBSearchResult.split("\n")[i].split("||")
					search_nm = search_nm + search_split[0] + "||"
					search_str += (i+1) + "." + search_split[7] + "(" + search_split[13] + "교수님) - " + search_split[12]
						+ " (" + search_split[16] + "/" + search_split[15] + ")\n"
				}
				r.reply(search_str)
				setDB("search_detail_"+sender+"_"+room,search_nm)
			}

		}
		/*
	if(msg=="/시간표검색"){
		r.reply("검색하실 과목명 or 교수명을 입력해주세요.\n'/기능 시간표검색'을 입력하여 메뉴얼을 확인해주세요")
	}
	else if(msg.indexOf("/시간표검색")==0){
		var UOSTimeDBSearchResult = ""
		if(msg.split(" ")[1] == "2018"){
			UOSTimeDBSearchResult = searchDB(msg.split(" ").slice(2,msg.split(" ").length).join(" "),2018)
		}
		else{
			UOSTimeDBSearchResult = searchDB(msg.split(" ").slice(1,msg.split(" ").length).join(" "),2019)
		}
		var UOSTimeNum = Number( UOSTimeDBSearchResult.split("\n").length ) // 데이터 없어도 기본 1임에 주의

		var search_str = ""
		var search_nm = "" // 검색결과가 몇번 DB인지를 임시 저장
		var search_split = ""

		if(UOSTimeNum == 1){
			r.reply("검색결과가 없습니다.")
			Api.replyRoom("봇장난",msg)
		}
		else{
			for(var i=0;i<UOSTimeNum-1;i++){
				search_split = UOSTimeDBSearchResult.split("\n")[i].split("||")
		 		search_nm = search_nm + search_split[0] + "||"
				search_str += (i+1) + "." + search_split[8] + "(" + search_split[11] + "교수님) - " + search_split[14] + "\n"
			}
			r.reply(search_str)
			setDB("search_detail_"+sender+"_"+room,search_nm)
		}
	}
	*/

		if(msg=="/시간표상세검색"){
			r.reply("'/기능 시간표상세검색'을 입력하여 메뉴얼을 확인해주세요")
		}
		/*
	D.insert("parsing_UOS_DB",{
			DB_num:DB_num[i],
			year:year,
			term:term,
			subject_div:subject_div[i],
			subject_div2:subject_div2[i],
			class_div:class_div[i],
			subject_no:subject_no[i],
			subject_nm:subject_nm[i], //7
			sub_dept:sub_dept[i],
			day_night_nm:day_night_nm[i],
			shyr:shyr[i],
			credit:credit[i],
			class_nm:class_nm[i], //12 //걍의실 및 시간
			prof_nm:prof_nm[i], //13
			class_type:class_type[i],
			tlsn_limit_count:tlsn_limit_count[i],
			tlsn_count:tlsn_count[i],
			etc_permit_yn:etc_permit_yn[i],
			sec_permit_yn:sec_permit_yn[i]
		})
	 */
		else if(msg.indexOf("/시간표상세검색")==0){ // str 최적화 필요
			var Num = Number(msg.substr(9))
			var str = ""
			var str2 = ""
			var str3 = ""
			var str4 = ""
			var str5 = ""
			if(Num%1==0){
				try{
					var search_nm = getDB("search_detail_"+sender+"_"+room).split("||")[Num-1]
					var selected_DB = D.selectForArray("parsing_UOS_DB",null,"DB_num is ?",search_nm)
					str += "강의년도 : "+selected_DB[0][1]+"년\n"
					if(selected_DB[0][2]=="A10"){
						str += "강의학기 : 1학기\n"
					}
					else if(selected_DB[0][2]=="A20") {
						str += "강의학기 : 2학기\n"
					}
					str += "교과목명 : "+selected_DB[0][7]+"\n"
					str += "담당교수님 : "+selected_DB[0][13]+"교수님\n"
					str += "강의실 및 시간 : "+selected_DB[0][12]+"\n"
					str += "교과번호 및 분반 : "+selected_DB[0][6]+"("+selected_DB[0][5]+"분반)\n"
					str += "학과 : "+selected_DB[0][8]+"\n"
					str += "교과구분 : "+selected_DB[0][3]+"("+selected_DB[0][4]+")\n"
					if(selected_DB[0][10]=="0"){
						str += "학년 : 대학원\n"
					}
					else {
						str += "학년 : " + selected_DB[0][10] + "\n"
					}
					str += "학점 : "+selected_DB[0][11]+"\n"
					str += "수강정원 : "+selected_DB[0][15]+"\n"
					str += "수강인원 : "+selected_DB[0][16]+"\n"
					if(selected_DB[0][14]==""){
						str += "외국어강의여부 : N\n"
					}
					else{
						str += "외국어강의여부 : Y\n"
					}
					str += "타과허용 : "+selected_DB[0][17]+"\n"
					str += "복전허용 : "+selected_DB[0][18]

					var apikey_1413 = "202002612JKC69748";
					//var apikey = "201808506NVF93269";
					var coursePlan = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiApiCoursePlanView.oapi?apiKey="+apikey_1413+"&year=2019&term=A10&subjectNo="+selected_DB[0][6]+"&classDiv="+selected_DB[0][5]).get().select("class_cont"))
					var coursePlanLength = coursePlan.split("<class_cont><![CDATA[").length

					for(var i=0 ; i<coursePlanLength-1 ; i++){
						str2 += (i+1)+"주차:"+coursePlan.split("<class_cont><![CDATA[")[i+1].split("]")[0].replace(/\r/g,"").replace(/\n/g,"")+"\n"
					}
					str3 = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiApiCoursePlanView.oapi?apiKey=201808506NVF93269&year="+selected_DB[0][1]+"&term="+selected_DB[0][2]+"&subjectNo="+selected_DB[0][6]+"&classDiv="+selected_DB[0][5]).get().select("score_eval_rate")).split("<score_eval_rate><![CDATA[")[1].split("]]>")[0].replace(/\t/g,"").split("□ ").join("\n□")
					str4 = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiApiCoursePlanView.oapi?apiKey=201808506NVF93269&year="+selected_DB[0][1]+"&term="+selected_DB[0][2]+"&subjectNo="+selected_DB[0][6]+"&classDiv="+selected_DB[0][5]).get().select("lec_goal_descr")).split("<![CDATA[")[1].split("]]>")[0].replace(/\t/g,"")
					str5 = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiApiCoursePlanView.oapi?apiKey=201808506NVF93269&year="+selected_DB[0][1]+"&term="+selected_DB[0][2]+"&subjectNo="+selected_DB[0][6]+"&classDiv="+selected_DB[0][5]).get().select("curi_edu_goal_nm")).split("<![CDATA[")[1].split("]]>")[0].replace(/\t/g,"")

					r.reply(str)
					r.reply(str5)
					r.reply(str4)
					r.reply(str3)
					r.reply(str2)


					/* form 예시
				교과목명 : 전자전기컴퓨터종합설계
				담당교수님 : 이승환교수님
				강의실 및 시간 : 수05,06,07,08,09/19-213/214
				교과번호 및 분반 : 40138(02분반)
				학과 : 전자전기컴퓨터공학부
				교과구분 : 전공선택(전공선택)
				학년 : 4
				학점 : 3
				외국어강의여부 : N
				*/
				}
				catch(e){
					r.reply("올바른 번호를 입력해주세요.")
				}

			}
			else{
				r.reply("올바른 번호를 입력해주세")
			}
		}

//=============================================================================================================================================


		if(room=="공지확인방"){
		}
		else if(msg.indexOf("/일반공지")==0&&msg.indexOf("/일반공지링크")!=0){
			UOSP1_list(r)
		}


		if(room=="공지확인방"){
		}
		else if(msg.indexOf("/전전컴공지")==0&&msg.indexOf("/전전컴공지링크")!=0){
			UOSP2_list(r)
		}


		if(room=="공지확인방"){
		}
		else if(msg.indexOf("/학사공지")==0&&msg.indexOf("/학사공지링크")!=0){
			UOSP3_list(r)
		}

		if(room=="공지확인방"){
		}
		else if(msg.indexOf("/경영공지")==0&&msg.indexOf("/경영공지링크")!=0){
			UOSPKY_list(r)
		}





//=============================================================================================================================================

		if(room=="공지확인방"){
		}
		else if(msg.indexOf("/롤 ")==0||msg.indexOf("/롤전적 ")==0||msg.indexOf("/롤티어 ")==0||msg.indexOf("/ㄹ ")==0){
			var summoner = msg.replace("/롤티어", "").replace("/롤전적","").replace("/롤","").replace("/ㄹ","").rmspace()

			//var summoner = msg.split(" ")[1]


			r.reply(parsingOPGG(summoner))
		}
		else if(msg=="/롤"){
			r.reply("검색하실 소환사명을 입력해주세요.\n'/기능 롤'을 입력하여 메뉴얼을 읽어주세요.")
		}

//=======================================================================================================================

		if(room=="공지확인방"){
		}
		else if(msg=="/전철"||msg=="/지하철"){
			r.reply("조회하실 역이름을 입력해주세요.\n'/기능 전철'을 입력하여 메뉴얼을 읽어주세요")
		}
		else if(msg.indexOf("/전철")==0){
			r.reply(Metro.output(room,msg.substr(4)))
		}
		else if(msg.indexOf("/지하철")==0||msg.indexOf("/메트로")==0){
			r.reply(Metro.output(room,msg.substr(5)))
		}


		if( msg.indexOf("/")==0 &&
			(
				msg.includess("양식당","아느칸","ㅇㄴㅋ") || msg.includess("생활관","기숙사","기식") || msg.includess("학식","ㅎㅅ") ||
				msg.includess("학관","학생회관") || msg.includess("자과관","자연과학관")
			)
			&&(room!="시립대 전전컴 톡방"||room!="시립대 단톡방")
		) {

			r.reply(HHaksik.getHaksik(msg))
		}


// =================================== 임시기능 모음 ===========================================

		if(msg=="/코로나"||msg=="/ㅋㄹㄴ"){
			r.reply(corona1());
			//r.reply(corona2().cut(12));
			r.reply("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun=");
		}



//=========================================================================================================================================


		if(msg=="/공갤확인"){
			var str_PU = ""
			for(var i=0 ; i<20 ; i++){
				str_PU += (i+1)+"."+getDB("DC_title_"+(getNum("DCP_max")-i))+"\n"
			}
			r.reply(str_PU)
			r.reply("/공갤확인 [번호] 입력하면 링크제공")
		}
		else if(msg.indexOf("/공갤확인")==0){
			if(msg.substring(6)<21&&msg.substring(6)>-1){
				r.reply( getDB("DCinside_pu_page_"+(Number(msg.substring(6))-1)) )
			}
			else if(msg.substring(5)<21&&msg.substring(5)>-1){
				r.reply( getDB("DCinside_pu_page_"+(Number(msg.substring(5))-1)) )
			}
			else{
				r.reply("1에서 20사이의 숫자를 입력해주세요.")
			}
		}

//=================================================================================================================================================

		setDB("ENG_finish_"+sender,"ON")

		if(msg=="/영어단어학습"){
			r.reply("\"/기능 영어단어학습\"을 입력해서 메뉴얼을 먼저 읽어주세요.")
		}
		else if(msg.indexOf("/영어단어학습프로필생성")==0){
			try{
				var name_Profile = msg.substring(13)
				D.create("profile_"+name_Profile,{번호:1,숙련도:1,횟수:0})
				updateProfile(name_Profile)
				r.reply(name_Profile+" 프로필이 등록되었습니다.")
			}
			catch(e){
				r.reply("이미 존재하는 프로필네임입니다.")
			}
		}
		else if(msg.indexOf("/영어단어학습종료")==0){
			setDB("englishProfileActive_"+sender,"OFF")
			r.reply("영어단어 학습이 종료되었습니다.")
		}
		else if(msg.indexOf("/영어단어학습시작")==0){
			var name_Profile = msg.substring(10)
			updateProfile(name_Profile) // 프로필 업데이트
			setDB("englishProfileSender_"+sender,name_Profile) // 해당 sender에 해당하는 profile 입력
			setDB("englishProfileRoom_"+sender,room) // 해당 sender가 있는 room 입력
			setDB("englishProfileActive_"+sender,"ON") // 영어학습 스위치 온

			r.reply("영어단어 학습이 시작되었습니다.")
			r.reply("뜻을 보고 싶으시면 아무 메세지나 입력해주세요")

			if(Rand16<4){ // 숙련도 1 (0)
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1],{orderBy:"번호 desc"}) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2],{orderBy:"번호 desc"}) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
			}
			else{
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4],{orderBy:"번호 desc"}) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1],{orderBy:"번호 desc"}) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
			}

			r.reply(getEDB(getDB("EngTempNum_"+sender))[1])
			setDB("EngPhase_"+sender,"WAIT") // 답변 대기
			setDB("ENG_finish_"+sender,"OFF")

		}

		if(getDB("englishProfileActive_"+sender)=="ON"&&getDB("EngPhase_"+sender)=="WAIT"&&getDB("ENG_finish_"+sender)=="ON"){ // 답변 대기상태에서 msg 수신
			r.reply(getEDB(getDB("EngTempNum_"+sender))[2])
			r.reply("단어를 알면 1, 보통이면 2, 모르면 3을 입력해주세요")
			setDB("EngPhase_"+sender,"WAIT2") // 답변 대기2
			setDB("ENG_finish_"+sender,"OFF")
		}

		if(getDB("englishProfileActive_"+sender)=="ON"&&getDB("EngPhase_"+sender)=="WAIT2"&&getDB("ENG_finish_"+sender)=="ON"){ // 답변 대기상태에서 msg 수신
			if(msg=="2"){ // +0
				var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
				D.update("profile_"+getDB("englishProfileSender_"+sender),{횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				setDB("EngPhase_"+sender,"NEXT") // 다음 단어로 이동
				//setDB("ENG_finish_"+sender,"OFF")
			}
			else if(msg=="3"){ // +1
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1]==2){ //횟수만 +1 하는 경우
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])

				}
				else{
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1] + 1;
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{숙련도:EngTemp1,횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				}
				setDB("EngPhase_"+sender,"NEXT") // 다음 단어로 이동
				//setDB("ENG_finish_"+sender,"OFF")
			}
			else if(msg=="1"){ // -1
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1]==1){ //횟수만 +1 하는 경우
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				}
				else{
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1] - 1;
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{숙련도:EngTemp1,횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				}
				setDB("EngPhase_"+sender,"NEXT") // 다음 단어로 이동
				//setDB("ENG_finish_"+sender,"OFF")
			}
			else if(msg=="22"){
				var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
				D.update("profile_"+getDB("englishProfileSender_"+sender),{횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				setDB("EngPhase_"+sender,"PRINTEX") // 예문 출력
				//setDB("ENG_finish_"+sender,"OFF")
			}
			else if(msg=="33"){ // +1
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1]==2){ //횟수만 +1 하는 경우
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				}
				else{
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1] + 1;
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{숙련도:EngTemp1,횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				}
				setDB("EngPhase_"+sender,"PRINTEX") // 예문 출력
				//setDB("ENG_finish_"+sender,"OFF")
			}
			else if(msg=="11"){ // -1
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1]==1){ //횟수만 +1 하는 경우
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				}
				else{
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][1] - 1;
					var EngTemp2 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender))[getDB("EngTempNum_"+sender)-1][2] + 1;
					D.update("profile_"+getDB("englishProfileSender_"+sender),{숙련도:EngTemp1,횟수:EngTemp2},"번호=?",[getDB("EngTempNum_"+sender)])
				}
				setDB("EngPhase_"+sender,"PRINTEX") // 예문출력
				//setDB("ENG_finish_"+sender,"OFF")
			}
			else{
				r.replyRoom("올바른 숫자를 입력해주세요")
				setDB("ENG_finish_"+sender,"OFF")
			}
		}

		if(getDB("englishProfileActive_"+sender)=="ON"&&getDB("EngPhase_"+sender)=="PRINTEX"&&getDB("ENG_finish_"+sender)=="ON"){ // 단어 출력
			r.reply(getEDB(getDB("EngTempNum_"+sender))[3])
			r.reply(getEDB(getDB("EngTempNum_"+sender))[4])
			r.reply("다음으로 넘어가고 싶으면 아무 메세지나 입력해주세요");
			setDB("EngPhase_"+sender,"WAIT3")
			setDB("ENG_finish_"+sender,"OFF")
		}

		if(getDB("englishProfileActive_"+sender)=="ON"&&getDB("EngPhase_"+sender)=="WAIT3"&&getDB("ENG_finish_"+sender)=="ON"){ // 단어 출력
			setDB("EngPhase_"+sender,"NEXT")
		}


		if(getDB("englishProfileActive_"+sender)=="ON"&&getDB("EngPhase_"+sender)=="NEXT"&&getDB("ENG_finish_"+sender)=="ON"){ // 단어 출력
			if(Rand16==0){ // 숙련도 1 (0)
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
			}
			else if(Rand16<=3){ // 숙련도 2 (123)
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
			}
			else if(Rand16<=9){ // 숙련도 3 (456789)
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
			}
			else{
				if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[4]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[1]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[2]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
				else if(D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3])!=""){
					var EngTemp1 = D.selectForArray("profile_"+getDB("englishProfileSender_"+sender),"번호","숙련도 = ?",[3]) // 숙련도 1에 해당하는 단어들 모두 출력
					var EngTemp2 = EngTemp1[Math.floor(Math.random() * EngTemp1.length)] // 단어들 중 하나 랜덤 뽑기
					setDB("EngTempNum_"+sender,EngTemp2) // 번호
				}
			}

			r.reply(getEDB(getDB("EngTempNum_"+sender))[1])
			setDB("EngPhase_"+sender,"WAIT") // 답변 대기
			setDB("ENG_finish_"+sender,"OFF")
		}


		if(msg=="/빈강의"){
			var lecLength = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A10&deptDiv=23100&dept=A200110111&subDept=A200160116").get().select("subject_nm")).split("<subject_nm><![CDATA[").length
			var str = ""
			var subject = "" //과목명
			var prof = ""//교수명
			var tsln_count = "" //수강인원
			var tsln_count_lmt = "" //수강정원

			var temp_subject = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A10&deptDiv=23100&dept=A200110111&subDept=A200160116").maxBodySize(0).get().select("subject_nm"))
			var temp_prof = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A10&deptDiv=23100&dept=A200110111&subDept=A200160116").maxBodySize(0).get().select("prof_nm"))
			var temp_tsln_count = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A10&deptDiv=23100&dept=A200110111&subDept=A200160116").maxBodySize(0).get().select("tlsn_count"))
			var temp_tsln_count_lmt = String(org.jsoup.Jsoup.connect("http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A10&deptDiv=23100&dept=A200110111&subDept=A200160116").maxBodySize(0).get().select("tlsn_limit_count"))


			try{
				for(var i=0 ; i<lecLength ; i++){
					subject = temp_subject.split("<subject_nm><![CDATA[")[i+1].split("</subject_nm>")[0].replace("\t","").replace("\n","").split("]]>")[0]
					prof = temp_prof.split("<prof_nm><![CDATA[")[i+1].split("</prof_nm>")[0].replace(/\n/g,"").replace(/\t/g,"").replace(" ","").split("]]>")[0]
					tsln_count = temp_tsln_count.split("<tlsn_count>")[i+1].split("</tlsn_count>")[0].replace(/\n/g,"").replace(/\t/g,"").replace(" ","")
					tsln_count_lmt = temp_tsln_count_lmt.split("<tlsn_limit_count>")[i+1].split("</tlsn_limit_count>")[0].replace(/\n/g,"").replace(/\t/g,"").replace(" ","")
					if( tsln_count_lmt!=0 && tsln_count<tsln_count_lmt && subject.indexOf("학업설계")<0 ){
						str += subject+"("+prof+"교수님) : ("+tsln_count+"/"+tsln_count_lmt+")\n"
					}
				}
				r.reply(str)
			}
			catch(e){
				r.reply(str)
			}
		}



		if(msg=="/중도"){
			r.reply(UOS_library.displayLibSeat(room))
		}
		if(msg=="/경도"){
			r.reply(getEcoLibSeat())
		}
		if(msg=="/법도"){
			r.reply(getLawLibSeat())
		}


		if(msg.indexOf("/과사번호")==0){
			if(msg.indexOf("행정")>0){r.reply("행정학과 : 02-6490-2010\n" + "21세기관(215호)")}
			else if(msg.indexOf("국")>0&&msg.indexOf("관")>0){r.reply("국제관계학과 : 02-6490-2035\n" + "21세기관(213호)")}
			else if(msg.indexOf("경제")>0){r.reply("경제학부 : 02-6490-2051\n" + "미래관(504호)")}
			else if(msg.indexOf("사")>0&&msg.indexOf("복")>0){r.reply("사회복지학과 : 02-6490-2075\n" + "21세기관(406호)")}
			else if(msg.indexOf("세무")>0){r.reply("세무학과 : 02-6490-2095\n" + "21세기관(411호)")}
			else if(msg.indexOf("경영")>0){r.reply("경영학부 : 02-6490-2210~4")}
			else if(msg.indexOf("전")>0&&msg.indexOf("컴")>0){r.reply("전자전기컴퓨터공학부 : 6490-2310")}
			else if(msg.indexOf("화")>0&&msg.indexOf("공")>0){r.reply("화학공학과 : 6490-2360")}
			else if(msg.indexOf("기")>0&&msg.indexOf("공")>0||msg.indexOf("기계")>0){r.reply("기계정보공학과 : 6490-2380")}
			else if(msg.indexOf("신소재")>0){r.reply("신소재공학과 : 6490-2400")}
			else if(msg.indexOf("토")>0&&msg.indexOf("공")>0||msg.indexOf("토목")>0){r.reply("토목공학과 : 6490-2420")}
			else if(msg.indexOf("컴")>0&&msg.indexOf("과")>0){r.reply("컴퓨터과학부 : 6490-2440")}
			else if(msg.indexOf("국")>0&&msg.indexOf("문")>0){r.reply("국어국문학과 : 6490-2530 or 6490-2534")}
			else if(msg.indexOf("영")>0&&msg.indexOf("문")>0){r.reply("영어영문학과 : 6490-2510~2511 or 6490-2514")}
			else if(msg.indexOf("국사")>0){r.reply("국사학과 : 6490-2551 or 6490-2554")}
			else if(msg.indexOf("철학")>0){r.reply("철학과 : 6490-2570 or 6490-2574")}
			else if(msg.indexOf("중")>0&&msg.indexOf("문")>0||msg.indexOf("중국어")>0){r.reply("중국어문화학과 : 6490-2586 or 6490-2589")}
			else if(msg.indexOf("수학")>0){r.reply("수학과 : 02-6490-2606~7\n" + "미래관 8층")}
			else if(msg.indexOf("통계")>0){r.reply("통계학과 : 02-6490-2625~6\n" + "미래관 7층")}
			else if(msg.indexOf("물리")>0){r.reply("물리학과 : 02-6490-2640~1\n" + "과학기술관 2층")}
			else if(msg.indexOf("생명")>0){r.reply("생명과학과 : 02-6490-2660~1\n" + "자연과학과 5층")}
			else if(msg.indexOf("환경원")>0||msg.indexOf("환원")>0||msg.indexOf("원예")>0){r.reply("환경원예학과 : 02-6490-2680~1\n" + "자연과학과 4층")}
			else if(msg.indexOf("도")>0||msg.indexOf("도시")>0){r.reply("도시과학대학  : 02-6490-2704")}
			else if(msg.indexOf("스포츠")>0||msg.indexOf("스과")>0||msg.indexOf("음악")>0||msg.indexOf("환조")>0||msg.indexOf("조각")>0||msg.indexOf("산디")>0||msg.indexOf("공디")>0||msg.indexOf("디자인")>0){r.reply("예술체육대학  : 02-6490-2702")}
			else if(msg.indexOf("자유")>0||msg.indexOf("자전")>0){r.reply("자유전공학부  : 6490-2126~7 or 6490-2129")}
		}







//==================================================================================================================================
//===================================      주식톡        ===========================================================================
//==================================================================================================================================


		if(msg=="/WTI"||msg=="/기름"||msg=="/유가"||msg=="/원유"||msg=="/wti")		{
			var WTI_Temp = []
			WTI_Temp = WTI_parse()
			sendKalingImage(room.replace(/,/g,""),WTI_Temp[2],"","WTI","",318,159)
			r.reply(WTI_Temp[0])
			r.reply(WTI_Temp[1])
		}
		if(msg=="/천가"||msg=="/천연가스"||msg=="/가스"||msg=="/천연")		{
			var natural_Gas_Temp = []
			natural_Gas_Temp = natural_Gas_parse()
			sendKalingImage(room.replace(/,/g,""),natural_Gas_Temp[2],"","천연가스","",665,412)
			r.reply(natural_Gas_Temp[0])
			r.reply(natural_Gas_Temp[1])
		}
		if(msg=="/금")		{
			var gold_Temp = []
			gold_Temp = Gold_parse()
			sendKalingImage(room.replace(/,/g,""),gold_Temp[2],"","금","",658,408)
			r.reply(gold_Temp[0])
			r.reply(gold_Temp[1])
		}
		if(msg=="/달러")		{
			var USD_Temp = []
			USD_Temp = USD_parse()
			sendKalingImage(room.replace(/,/g,""),USD_Temp[2],"","미국 달러","",658,408)
			r.reply(USD_Temp[0])
			//r.reply(USD_Temp[1])
		}
		if(msg=="/나스닥")		{
			r.reply(NASDAQ_parse())
		}
		if(msg=="/코스피")		{
			r.reply(KOSPI_parse())
		}
		if(msg=="/지표요약"){
			r.reply(Stock.start_summary())
		}


		/* 해당 코드는 AWS로 이관되었음
		if(msg.indexOf("/주식정보")==0){
			var stock_temp1 = msg.split(" ")[1]
			var stock_temp2 = Stock.search_detail_return(stock_temp1)
			if(msg.indexOf("/주식정보1일")==0){
				sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/day/"+stock_temp2[4]
					+"_end.png","sirip.kr",stock_temp2[5]+" 1일","",658,408)
			}
			else if(msg.indexOf("/주식정보일봉")==0){
				sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/candle/day/"+stock_temp2[4]
					+"_end.png","sirip.kr",stock_temp2[5]+" 일봉","",658,408)
			}
			else if(msg.indexOf("/주식정보주봉")==0){
				sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/candle/week/"+stock_temp2[4]
					+"_end.png","sirip.kr",stock_temp2[5]+" 주봉","",658,408)
			}
			else if(msg.indexOf("/주식정보월봉")==0){
				sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/candle/week/"+stock_temp2[4]
					+"_end.png","sirip.kr",stock_temp2[5]+" 월봉","",658,408)
			}
			else{
				sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/candle/day/"+stock_temp2[4]
					+"_end.png","sirip.kr",stock_temp2[5]+" 일봉","",658,408)
			}

			r.reply(stock_temp2[0]+"\n"+stock_temp2[1])
			r.reply(stock_temp2[2]+"\n"+stock_temp2[3])

		}

		if(msg.indexOf("/1일")==0){
			var stock_temp1 = msg.split(" ")[1]
			var stock_temp2 = Stock.search(stock_temp1)
			sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/day/"+stock_temp2[0]
				+"_end.png","sirip.kr",stock_temp2[1]+" 1일","",658,408)
		}
		if(msg.indexOf("/일봉")==0){
			var stock_temp1 = msg.split(" ")[1]
			var stock_temp2 = Stock.search(stock_temp1)
			sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/candle/day/"+stock_temp2[0]
				+"_end.png","sirip.kr",stock_temp2[1]+" 일봉","",658,408)
		}
		if(msg.indexOf("/주봉")==0){
			var stock_temp1 = msg.split(" ")[1]
			var stock_temp2 = Stock.search(stock_temp1)
			sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/candle/week/"+stock_temp2[0]
				+"_end.png","sirip.kr",stock_temp2[1]+" 주봉","",658,408)
		}
		if(msg.indexOf("/월봉")==0){
			var stock_temp1 = msg.split(" ")[1]
			var stock_temp2 = Stock.search(stock_temp1)
			sendKalingImage(room,"https://ssl.pstatic.net/imgfinance/chart/mobile/candle/month/"+stock_temp2[0]
				+"_end.png","sirip.kr",stock_temp2[1]+" 월봉","",658,408)
		}

		*/


//==================================================================================================================================
//==================================================================================================================================


		//섹무새
		if(r.s=="ㅇㅅㅁ"&&msg=="섹섹섹섹"){replier.reply("스스스스")}
		else if(r.s=="ㅇㅅㅁ"&&msg=="섹섹섹섹!"){replier.reply("스스스스!")}
		else if(r.s=="ㅇㅅㅁ"&&msg=="섹섹섹"){replier.reply("스스스")}
		else if(r.s=="ㅇㅅㅁ"&&msg=="섹섹섹!"){replier.reply("스스스!")}
		else if(r.s=="ㅇㅅㅁ"&&msg=="섹섹"){replier.reply("스스")}
		else if(r.s=="ㅇㅅㅁ"&&msg=="섹섹!"){replier.reply("스스!")}
		else if(r.s=="ㅇㅅㅁ"&&msg.substring(0,1)=="섹"&&msg.substring(1,2)!="스"){replier.reply("스"+msg.substring(1,2))}

//==================================================================================================================================
//===================================      채팅존        ===========================================================================
//==================================================================================================================================


		//냥냥댁솦생성기(갓기능)
		if(msg.indexOf("/냥냥댁솦")==0||msg.indexOf("/ㄴㄴㄷㅅ")==0){
			for(var j=0; j<msg.substring(6); j++){
				var NNDSs=["이릴","댁","솦","냥","비"];
				var NNDS="";
				for(var i=0; i<10; i++){
					NNDS+=NNDSs[Math.floor(Math.random()*5)];
				}
				Api.replyRoom("시갤톡방",NNDS);
			}
		}


		//오목
		if(msg.indexOf("/오목대결")==0 && (!omokRoom.includes(room))) {
			omokRoom.push(room)
			var def = msg.substr(6)
			var o = new Minigame.Omok(room,sender,def)
			o.start()
		}
		//타자
		if(msg == "/타자대결" && (!tajaRoom.includes(room))) {
			tajaRoom.push(room)
			var taja = new Minigame.Taja(room)
			taja.start()
		}




//=====================================================================================================================================
//==============================================   로깅기능    ===================================================================
//=====================================================================================================================================

		if(sender=="슈발베"&&room=="시갤톡방"&&msg.indexOf("/추적시작")==0){
			setDB("추적자",msg.substring(6))
			Api.replyRoom("시갤톡방",msg.substring(6)+" 추적시작");
		}
		if(sender=="슈발베"&&room=="시갤톡방"&&msg.indexOf("/추적해제")==0){
			setDB("추적자","")
			Api.replyRoom("시갤톡방",msg.substring(6)+" 추적해제");
		}
		if(room=="시갤톡방"&&sender==getDB("추적자")){
			Api.replyRoom("시갤톡방",getDB("추적자")+":"+msg)
		}

		if(room=="시갤톡방"&&msg.indexOf("이짜나")>-1){
			var temp_Ham = "하아";
			for(var i=0 ; i<Math.floor(Math.random() *30 ) ; i++){
				temp_Ham += "아";
			}
			temp_Ham += "암";
			Api.replyRoom("시갤톡방",temp_Ham)
		}



	}    catch(e){
		Api.replyRoom("봇장난","Response Error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
	}




}
//=======================================================================================================================================
//=======================================================================================================================================
//========================================      response 함수 끝      ===================================================================
//=======================================================================================================================================
//=======================================================================================================================================


// =================================== 핵식 함수 ===================================

function update() {
	timer.start();
	Api.replyRoom(console_room_name,"updating...");
	Git.pull("https://github.com/Schwalbe262/UOS_BOT_4","/sdcard/katalkbot/Bots/main")
	Api.replyRoom(console_room_name,"complete");
	var time = timer.end();
	var msg = "time : " + java.lang.String.format("%.2f",time/1000) + "sec";
	Api.replyRoom(console_room_name,msg);

	return ""
}

function reload () { // 코드 리로드
	timer.start();
	switcher=0;
	Api.replyRoom(console_room_name,"리로드 시작...");
	wake.on();
	try{
		Api.reload();
	}catch(e){
		Api.replyRoom(console_room_name,e + "\n" + e.stack);
	}
	wake.off();
	var time = timer.end();
	Api.replyRoom(console_room_name,"리로드 완료!");
	msg = "경과시간: " + java.lang.String.format("%.2f",time/1000) + "초";
	Api.replyRoom(console_room_name,msg);
}

wake=(function() {
	var PM=android.os.PowerManager;
	var pm =Api.getContext().getSystemService(android.content.Context.POWER_SERVICE);

	var wl= pm.newWakeLock(PM.SCREEN_DIM_WAKE_LOCK|PM.ACQUIRE_CAUSES_WAKEUP |PM.ON_AFTER_RELEASE,"FAIL");
	return {
		on :function(){
			if(!wl.isHeld()){
				wl.acquire();
				Api.replyRoom(console_room_name,"cpu온");
			}
		},
		off:function(){
			if(wl.isHeld()){
				wl.release();
				Api.replyRoom(console_room_name,"cpu오프");
			}
		},
		toString: function(){
			return wl.toString();
		}
	}
})();

timer = new (function(){ // 타이머
	var low=new Date();
	return {
		start : function() {
			low = new Date();
		},
		end : function() {
			var present = new Date;
			return present - low;
		}
	}})();

function saveFile(file, str) {
	//var filedir = new java.io.File("/sdcard/kbot/"+ file);
	//var filedir = new java.io.File("/sdcard/ChatBot/BotData/시립"+ file);
	var path = (file[0]=="/") ? file : "/sdcard/katalkbot/Bots/main/"+ file
	var filedir = new java.io.File(path);
	try {
		var bw = new java.io.BufferedWriter(new java.io.FileWriter(filedir));
		bw.write(str.toString());
		bw.close();
	} catch (e) {
		return e;
	}
}

function readFile(file) {
	var filedir = new java.io.File("/sdcard/katalkbot/Bots/main/"+  file);
	try {
		var br = new java.io.BufferedReader(new java.io.FileReader(filedir));
		var readStr = "";
		var str = null;
		while (((str = br.readLine()) != null)) {
			readStr += str + "\n";
		}
		br.close();
		return readStr.trim();
	} catch (e) {
		return e;
	}
}

function require(src,force){
	if(!force && cacheModule[src]!=undefined){
		return cacheModule[src];
	}
	else{
		var module = {exports:{}}
		var exports=module.exports
		eval(readFile("node_modules/"+src))
		cacheModule[src] = module.exports;
		return module.exports
	}
}

//====================================== 카링 ======================================



const kalingModule=require("kaling.js").Kakao();
function kakaoReset(){
	Kakao=new kalingModule();
	Kakao.init("29fbf6ec828f27d72544c39a3bb4f8d0"); // P.kakaoint자리
	//Kakao.init("e02397085dc52168fe675d7013e1cfbf"); // P.kakaoint자리

	Kakao.login(getDB("kakaoId"), getDB("kakaoPw"));
}
kakaoReset()
function sendKalingImage(room, imageURL, URL, description,button,width, height){
	var kalingObj={
		"link_ver": "4.0",
		"template_object": {
			"object_type": "feed",
			"content": {
				"title": "",
				"image_url": imageURL,
				"image_width": width||0,
				"image_height": height||0,
				"link": {
					"web_url": URL,
					"mobile_web_url": URL
				},
				"description": description || ""
			},
			"buttons": [{
				"title": button || "",
				"link": {
					"web_url": URL,
					"mobile_web_url": URL
				}
			}]
		}
	};
	try{
		Kakao.send(room, kalingObj );
	}catch(e){
		kakaoReset();
		Kakao.send(room, kalingObj );
	}

}

//========================================= 카링 끝 =========================================

function setTimeout(callback,args,time){
	new java.lang.Thread(new java.lang.Runnable(function(){
		java.lang.Thread.sleep(time)
		callback.apply(null,args)
	})).start()
}

function delayReply(room,msg,time) {
	java.lang.Thread.sleep(time)
	Api.replyRoom(room,msg)
}

function show (room, sender, cnt) {
	a = Api.getMessageList().filter((v) => {
			return Boolean((!room || v[0] == room) && (!sender || v[1] == sender));
		}
	).map(v => v[1] + ":" + v[2]);
	return a.slice(a.length - cnt).join("\n");
}


String.prototype.I=function(keyword){ // String에 keyword가 있는지 검사
	if(this.includes(keyword)){return true}
	else{return false}
}

String.prototype.L=function(keyword){ // String의 마지막 단어에 keyword가 있는지 검사
	var temp = this.split(" ")
	if(temp[(temp.length)-1].I(keyword)){return true}
	else{return false}
}

String.prototype.F=function(keyword){ // String의 첫 단어에 keyword가 있는지 검사
	var temp = this.split(" ")
	if(temp[0].I(keyword)){return true}
	else{return false}
}

String.prototype.DB=function(){ // 괄호와 괄호 안에 있는 데이터 삭제
	var str2 = this.replace(/\([^()]*\)/,"")
	return str2
}

String.prototype.cut=function(line){
	var str=this.toString()
	str=str.split('\n')
	str[line-1]+=Array(500).join(String.fromCharCode(8237))
	str=str.join('\n')
	return str;
}

String.prototype.hashCode = function(){
	var hash = 0;
	for (var i = 0; i < this.length; i++) {
		var character = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+character;
		hash = Math.abs(hash & hash); // Convert to 32bit integer
	}
	return hash;
}

Object.defineProperty(Object.prototype,"$",   {
	get:function(){
		var self=this;
		return Object.getOwnPropertyNames(this).map(v=>{
			try{
				return v+" : "+self[v]
			}catch(e){ }
			return v+" : error"

		}).join("\n");
	}
});



function move(state,action){
	var after_state = [0,[0,0],[0,0]]
	after_state = state

	if(action[0] == state[0]){
		if(state[0]==1){ // 왼쪽에서 오른쪽으로
			after_state[0] = 2
			after_state[1][0] = state[1][0] - action[1]
			after_state[1][1] = state[1][1] - action[2]
			after_state[2][0] = state[2][0] + action[1]
			after_state[2][1] = state[2][1] + action[2]
		}
		else if(state[0]==2){ // 왼쪽에서 오른쪽으로
			after_state[0] = 1
			after_state[1][0] = state[1][0] + action[1]
			after_state[1][1] = state[1][1] + action[2]
			after_state[2][0] = state[2][0] - action[1]
			after_state[2][1] = state[2][1] - action[2]
		}
		return after_state
	}
	else{
		return 0
	}
}


//reply함수
function reply(msg){
	return replier.reply(msg);
}

/* 번역기코드 (폐쇄)
function translateText(transIn,transOut,transStr){
	var url = "https://www.googleapis.com/language/translate/v2?key=AIzaSyDhs38lDsjWNLi97qoOlQa6mjQlazyTMwc&source="+ transIn +"&target="+ transOut +"&q="+encodeURI(transStr)
	var conn = new java.net.URL(url).openConnection();
	conn.setRequestProperty("Content-Type", "application/json;charset=utf-8");
	var is = conn.getInputStream();
	var br = new java.io.BufferedReader(new java.io.InputStreamReader(is));
	var str = "";
	var tmp = null;
	while (((tmp = br.readLine()) != null)) {
		str += tmp + "\n";
	}
	br.close();
	return JSON.parse(str).data.translations[0].translatedText
}
*/


//=====================================================================================================================================
//====================================================    파싱     ====================================================================
//=====================================================================================================================================

function webRead(url) {
	try {
		var contentType = "application/xml";
		var charset = "utf-8";
		var mobile = false;
		var preset = [];
		var reg;
		for (var i = 1; i < arguments.length; i++) {
			var arg = arguments[i];
			if (/^\w+\/\w+$/.test(arg)) {
				contentType = arg;
			} else {
				if (arg.toLowerCase() == "android" || arg.toLowerCase() == "mobile") {
					mobile = true;
				} else {
					if (arg.toLowerCase() == "utf-8" || arg.toLowerCase() == "euc-kr") {
						charset = arg;
					} else {
						if (reg = /^([^:]+):([^:]+)$/.exec(arg)) {
							preset.push({key: reg[1], value: reg[2]});
						}
					}
				}
			}
		}
		var conn = new java.net.URL(url).openConnection();
		conn.setRequestProperty("Content-Type", contentType + "; charset=" + charset);
		if (mobile) {
			conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19");
		} else {
			conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36");
		}
		for (var i = 0; i < preset.length; i++) {
			conn.setRequestProperty(preset[i].key, preset[i].value);
		}
		var br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
		var str = "";
		var tmp = null;
		while ((tmp = br.readLine()) != null) {
			str += tmp + "\n";
		}
		return str;
	}
	catch (e) {
		return {str:undefined, e:e, toString:function(){return this.str}
		}
	}
}


function DCparsing(start,end){

	var str = ""
	var number = ""
	var time = ""
	var id = ""
	var title = ""
	var word = ""
	var ip = ""
	var str_out = ""
	for(var i=start ; i<end+1 ; i++){
		try{ // try
			str = webRead("http://m.dcinside.com/view.php?id=pu&no="+i,"User-Agent","Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19")
			number = i
			time = str.split("<input type=\"hidden\" name=\"date_time\" id=\"date_time\" value=\"")[1].split("\"/>")[0]
			id = str.split("<!-- 갤본문 -->")[1].split("<div class=\"view_head\">")[1].split("<span>")[2].split("</span>")[0]
			title = str.split("<span class=\"tit_view\">")[1].split("<span class")[0].split("<img ")[0]
			word = str.split("<div class=\"view_main\">")[1].split("</div>")[0].replace(/<br[^\/]+\/>/g,"\n").replace(/^[\n\s]+/g,"").replace(/<[^>]+>/g,"").rmspace()
			ip = str.split("<span class=\"ip\">")[1].split("</span>")[0]
			str_out = number+"||"+time+"||"+id+"||"+title+"||"+word+"||"+ip+"\n"
			setDB("DB_PU"+i,str_out)
		} // try
		catch(e){
		}
	}
}



/*
function parsing(){ // DCinside 공립대학교 갤러리 파싱코드

	var str = webRead("http://m.dcinside.com/list.php?id=pu&no="+getDB("DCP_max")+"&page=1","mobile")



	var strTitle = str.split("이미지</span>")
	var strTitleResult=[];
	for(var i=1 ; i<strTitle.length ; i++){
		strTitleResult[i-1]=strTitle[i].split("</span>")[0].split("\n")[0]
		setDB( "DCinside_pu_title_"+(i-1), strTitleResult[i-1] )
	}

	var strName = str.split("<ul class=\"ginfo\">") // 이름데이터
	var strNameResult=[];
	for(var j=1 ; j<strName.length-2 ; j++){
		strNameResult[j-1]=strName[j+2].split("<li>")[1].split("</li>")[0].replace("<span class='sp-nick gonick'></span>","")
		setDB( "DCinside_pu_name_"+(j-1), strNameResult[j-1] )
	}

	var strPage = str.split("<div class=\"gall-detail-lnktb\">") // 페이지주소데이터
	var strPageResult=[];
	for(var j=1 ; j<strPage.length ; j++){
		strPageResult[j-1]=strPage[j].split("<a href=\"http://m.dcinside.com/board/pu/")[1].split("\" class=\"lt\">")[0]
		setDB( "DCinside_pu_page_"+(j-1), strPageResult[j-1] )
	}
	var strNumberResult = strPageResult[0].split("pu&no=")[1].split("&page=")[0]
	if( strNumberResult > getDB("DCinside_pu_number") || getDB("DCinside_pu_number")==undefined  ){ // 글이 삭제되어 글번호가 낮아졌을 경우에는 기록하지않음
		setDB("DCinside_pu_number",strNumberResult) // 맨 마지막글의 글번호
	}

}
*/

function DCP(){ // DC 파싱

	var i = 0;

	str = org.jsoup.Jsoup.connect("http://m.dcinside.com/board/pu").userAgent("Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19").get().select("ul.gall-detail-lst div.gall-detail-lnktb").toArray().map(v=>[v.select("a").first().attr("href"), v.select("span.detail-txt").text(), v.select("li").first().text()])
	if( Number(str[0][0].split("http://m.dcinside.com/board/pu/")[1]) <= getNum("DCP_max") ){ // 새로운 글이 없을 경우
		return 0;
	}
	else{
		while( Number(str[i][0].split("http://m.dcinside.com/board/pu/")[1]) > getNum("DCP_max") ){
			i++
		}
		setDB("DCP_max",str[0][0].split("http://m.dcinside.com/board/pu/")[1])
	}

	if(i==1){
		Api.replyRoom("시갤톡방","공립대학교 갤러리에 새로운 글이 올라왔습니다.\n제목 : "+str[0][1]+"\n작성자 : "+str[0][2])
		Api.replyRoom("시갤톡방",randReply("비추박으러 가기 : ","개추박으러 가기 : ","댓글달러 가기 : ","보러 가기 : ") + str[0][0] )
	}
	else if(i==2){
		Api.replyRoom("시갤톡방","공립대학교 갤러리에 새로운 글이 올라왔습니다.\n제목 : "+str[0][1]+"\n작성자 : "+str[0][2])
		Api.replyRoom("시갤톡방",randReply("비추박으러 가기 : ","개추박으러 가기 : ","댓글달러 가기 : ","보러 가기 : ") + str[0][0] )
		Api.replyRoom("시갤톡방","공립대학교 갤러리에 새로운 글이 올라왔습니다.\n제목 : "+str[1][1]+"\n작성자 : "+str[1][2])
		Api.replyRoom("시갤톡방",randReply("비추박으러 가기 : ","개추박으러 가기 : ","댓글달러 가기 : ","보러 가기 : ") + str[1][0] )
	}
	else if(i==3){
		Api.replyRoom("시갤톡방","공립대학교 갤러리에 새로운 글이 올라왔습니다.\n제목 : "+str[0][1]+"\n작성자 : "+str[0][2])
		Api.replyRoom("시갤톡방",randReply("비추박으러 가기 : ","개추박으러 가기 : ","댓글달러 가기 : ","보러 가기 : ") + str[0][0] )
		Api.replyRoom("시갤톡방","공립대학교 갤러리에 새로운 글이 올라왔습니다.\n제목 : "+str[1][1]+"\n작성자 : "+str[1][2])
		Api.replyRoom("시갤톡방",randReply("비추박으러 가기 : ","개추박으러 가기 : ","댓글달러 가기 : ","보러 가기 : ") + str[1][0] )
		Api.replyRoom("시갤톡방","공립대학교 갤러리에 새로운 글이 올라왔습니다.\n제목 : "+str[2][1]+"\n작성자 : "+str[2][2])
		Api.replyRoom("시갤톡방",randReply("비추박으러 가기 : ","개추박으러 가기 : ","댓글달러 가기 : ","보러 가기 : ") + str[2][0] )
	}
	else if(i>3){
		Api.replyRoom("시갤톡방","공립대학교 갤러리에 새로운 글이 "+i+"개 올라왔습니다.")
		Api.replyRoom("시갤톡방",randReply("비추박으러 가기 : ","개추박으러 가기 : ","댓글달러 가기 : ","보러 가기 : ") + "http://m.dcinside.com/board/pu/" )
	}
}

/*
function parsingUOS1(){ // 일반공지 파싱코드 (정규식만 이용)
	var url = "http://www.uos.ac.kr/korNotice/list.do?list_id=FA1" // url객체
	var conn = new java.net.URL(url).openConnection(); // URL을 통해 인터넷과 연결
	conn.setRequestProperty("Content-Type", "text/xml;charset=utf-8"); // 요청&응답 방식
	conn.setRequestProperty("User-Agent","Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19");

	var is = conn.getInputStream();
	var br = new java.io.BufferedReader(new java.io.InputStreamReader(is));
	var str = "";
	var tmp = null;


	while ((tmp = br.readLine()) != null) { // 읽어올 값이 없을때까지 출력
		str += tmp + "\n";
	}

	var reg = /class="mhide">([^<]+)<\/span>([^<]+)<\/a>/g //파싱 정규식 [1]글번호, [2]글제목
	var reg2 = /class="mhide">([^<]+)<\/span>([^<]+)<\/a>/g //파싱 정규식 [1]글번호, [2]글제목
	setDB("lastNumberUOS1",reg2.exec(str)[1]) // 일반공지 마지막 글번호 저장
	for(var i=0 ; i<10 ; i++){
		setDB("DBUOS1_"+i,reg.exec(str)[2]) // DB에 글제목 저장
	}
	 확인코드
	for(var i=0 ; i<10 ; i++){
		getDB("DBUOS1_"+i) // DB에 글제목 저장
	}

}
*/

/*
function parsingUOS1(){
	var str = webRead("http://www.uos.ac.kr/korNotice/view.do?list_id=FA1&seq="+getDB("UOS1max")+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10")
	var title = str.split("<title>")[1].split("</title>")[0].split(" &lt;")[0]
	if(title == "" || title == "MIWIFI" || title == "서울시립대학교" || title == "undefined" || title == undefined){
		return 0
	}
	else{
		setDB("titleUOS1"+getNum("UOS1max"),title)
		setDB("UOS1max",getNum("UOS1max")+1)
		return 1
	}
}

function UOSP1(){
	var str = ""
	var str2 = ""
	if(parsingUOS1()==1&& getDB("titleUOS1"+(getNum("UOS1max")-1))!=getDB("titleUOS1"+(getNum("UOS1max")-2)) ){
		str += "일반 공지가 새로 게시되었습니다\n"
		str += getDB("titleUOS1"+(getNum("UOS1max")-1))
		str2 += "보러가기 : http://www.uos.ac.kr/korNotice/view.do?list_id=FA1&seq="+(getDB("UOS1max")-1)+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
		Api.replyRoom("봇장난",str)
		Api.replyRoom("봇장난",str2)
		Api.replyRoom("공지확인방",str)
		Api.replyRoom("공지확인방",str2)
		setTimeout(Api.replyRoom,["공지확인방2",str],300000)
		setTimeout(Api.replyRoom,["공지확인방2",str2],300000)
	}
	else if(parsingUOS1()==1&& getDB("titleUOS"+(getNum("UOS1max")-1))==getDB("titleUOS"+(getNum("UOS1max")-2)) ){
	}
}
*/



function UOSP1() { // 일반공지코드 신형 (2019_09_25)
	var str = ""
	var str2 = ""
	var title = "" // 새로 파싱된W 제목 명
	//var number = ""// 글번호
	var temp = 0; // 필독공지가 아닌 최초시점 공지 번호 기록
	var parse = "";
	var adress = ""; // 주소번호
	//var parse = String(org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get())
	var SW_new = 0; // 새로운 공지가 파싱되었을 경우 1이됨

	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA1").get().select("ul.listType>li:not(.on)>a").get(0)
	title = parse.ownText()
	adress = parse.attr("onclick").split("'")[3]
	//number = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA1").get().select("ul.listType>li:not(.on)>a>span").get(0).text()


	if (title == "" || title == "MIWIFI" || title == undefined) { // 오류일시 종료
		return 0;
	}
	// ECE_last가 371번일 때 새로운 내용이 파싱되면 371번에 기록된다.
	if (getDB("title_UOSP1_" + (getNum("UOSP1_last") - 1)) != title) { // 새로운 내용이 파싱되었을 경우
		setDB("title_UOSP1_" + getDB("UOSP1_last"), title) // 새로 파싱된 내용 DB에 기록
		setDB("UOSP1_last", getNum("UOSP1_last") + 1) // 다음 파싱을 위해 카운트 +1
		SW_new = 1
	}

	if (SW_new == 1) {
		str += "일반 공지가 새로 게시되었습니다\n"
		str += title
		str2 += "보러가기 : http://www.uos.ac.kr/korNotice/view.do?list_id=FA1&seq=" + adress + "&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)

		sendKalingImage(UOS_SG_name,
			"",
			"http://www.uos.ac.kr/korNotice/view.do?list_id=FA1&seq=" + adress + "&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
			,str,"보러가기",0,0)

		//sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,
			"",
			"http://www.uos.ac.kr/korNotice/view.do?list_id=FA1&seq=" + adress + "&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
			,str,"보러가기",0,0)
		//sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		/*
		sendKalingImage("시립대공지확인방2",
			"",
			"http://www.uos.ac.kr/korNotice/view.do?list_id=FA1&seq=" + adress + "&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
			,str,"보러가기",0,0)
			*/
		//sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
	}
}

function UOSP1_list(r) {
	var str = ""
	var str2 = ""
	str += org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA1").get().select("ul.listType>li:not(.on)").toArray().map((v,i)=>(i+1)+". "+v.selectFirst("a").ownText()).join("\n")
	str2 += "보러가기 : http://www.uos.ac.kr/korNotice/list.do?list_id=FA1"
	r.reply(str)
	r.reply(str2)
}


/*
function UOSP1(){ // 구형코드
	var str = ""
	var str2 = ""

	var i=0;

	var check = 0; //새로 파싱된 내용이 있으면 check = 1

	var title = []
	var number_Adress = []
	var number_Title = []
	var temp = String(org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA1").get()).split(' <!-- 일반 --> ')[1]

	while(i<10){
		title[i] = temp.split("</span>")[i+1].split("</a>")[0]
		number_Adress[i] = temp.split("fnView")[i+1].split(", '")[1].split("');")[0]
		number_Title[i] = temp.split("<span class=\"mhide\">")[i+1].split("</span>")[0]

		if( number_Title[i] == getNum("UOS1_max")-1 ){
			setDB("UOS1_max",getNum("UOS1_max")+1)
			setDB("title_UOS1_"+getDB("UOS1_max"),title[i])
			setDB("Adress_UOS1_"+getDB("UOS1_max"),number_Adress[i])
			i=10;
			check = 1;
		}
		i++;
	}

	if(check==1){ //새로 파싱된 내용이 있을 경우
		str += "일반 공지가 새로 게시되었습니다\n"
		str += getDB("title_UOS1_"+getDB("UOS1_max"))
		str2 += "보러가기 : http://www.uos.ac.kr/korNotice/view.do?list_id=FA1&seq="+getDB("Adress_UOS1_"+getDB("UOS1_max"))+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
		if(str.includes("페미")) {
			Api.replyRoom("봇장난","페미공지 필터링 완료\n"+str2);
			return;
		}
		Api.replyRoom("봇장난",str)
		Api.replyRoom("봇장난",str2)
		Api.replyRoom("공지확인방",str)
		Api.replyRoom("공지확인방",str2)
		Api.replyRoom("시갤톡방",str)
		Api.replyRoom("시갤톡방",str2)
		Api.replyRoom("시립대공지확인방",str)
		Api.replyRoom("시립대공지확인방",str2)
	}
}
*/

function UOSP3() { // 학사공지코드 신형 (2019_09_25)
	var str = ""
	var str2 = ""
	var title = "" // 새로 파싱된W 제목 명
	//var number = ""// 글번호
	var temp = 0; // 필독공지가 아닌 최초시점 공지 번호 기록
	var parse = "";
	var adress = ""; // 주소번호
	//var parse = String(org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get())
	var SW_new = 0; // 새로운 공지가 파싱되었을 경우 1이됨

	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA2&seq=0&sort=&pageIndex=1&searchCnd=&searchWrd=&cate_id=&viewAuth=Y&writeAuth=N&board_list_num=10&lpageCount=10").get().select("ul.listType>li:not(.on)>a").get(0)
	title = parse.ownText()
	adress = parse.attr("onclick").split("'")[3]
	//number = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA1").get().select("ul.listType>li:not(.on)>a>span").get(0).text()


	if (title == "" || title == "MIWIFI" || title == undefined) { // 오류일시 종료
		return 0;
	}
	// ECE_last가 371번일 때 새로운 내용이 파싱되면 371번에 기록된다.
	if (getDB("title_UOSP3_" + (getNum("UOSP3_last") - 1)) != title) { // 새로운 내용이 파싱되었을 경우
		setDB("title_UOSP3_" + getDB("UOSP3_last"), title) // 새로 파싱된 내용 DB에 기록
		setDB("UOSP3_last", getNum("UOSP3_last") + 1) // 다음 파싱을 위해 카운트 +1
		SW_new = 1
	}

	if (SW_new == 1) {
		str += "학사 공지가 새로 게시되었습니다\n"
		str += title
		str2 += "보러가기 : http://www.uos.ac.kr/korNotice/view.do?list_id=FA2&seq="+adress+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		/*
		sendKalingImage("시갤톡방","","sirip.kr",str,"",0,0)
		sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		*/


		sendKalingImage(UOS_SG_name,
			"",
			"http://www.uos.ac.kr/korNotice/view.do?list_id=FA2&seq="+adress+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
			,str,"보러가기",0,0)

		//sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,
			"",
			"http://www.uos.ac.kr/korNotice/view.do?list_id=FA2&seq="+adress+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
			,str,"보러가기",0,0)
		//sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		/*
		sendKalingImage("시립대공지확인방2",
			"",
			"http://www.uos.ac.kr/korNotice/view.do?list_id=FA2&seq="+adress+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
			,str,"보러가기",0,0)
			*/

		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)

	}
}

function UOSP3_list(r) {
	var str = ""
	var str2 = ""
	str += org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA2&seq=0&sort=&pageIndex=1&searchCnd=&searchWrd=&cate_id=&viewAuth=Y&writeAuth=N&board_list_num=10&lpageCount=10").get().select("ul.listType>li:not(.on)").toArray().map((v,i)=>(i+1)+". "+v.selectFirst("a").ownText()).join("\n")
	str2 += "보러가기 : http://www.uos.ac.kr/korNotice/list.do?list_id=FA2&seq=0&sort=&pageIndex=1&searchCnd=&searchWrd=&cate_id=&viewAuth=Y&writeAuth=N&board_list_num=10&lpageCount=10"
	r.reply(str)
	r.reply(str2)
}

/*
function UOSP3(){ // 학사공지 (구형코드)
	var str = ""
	var str2 = ""

	var i=0;

	var check = 0; //새로 파싱된 내용이 있으면 check = 1

	var title = []
	var number_Adress = []
	var number_Title = []
	var temp = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/korNotice/list.do?list_id=FA2&seq=0&sort=&pageIndex=1&searchCnd=&searchWrd=&cate_id=&viewAuth=Y&writeAuth=N&board_list_num=10&lpageCount=10").get().select("ul.listType>li:not(.on)")
	var temp2 = []

	while(i<10){
		temp2[i] = temp.get(i)
		title[i] = temp2[i].select("a").first().ownText()
		number_Adress[i] = String(temp2[i].selectFirst("a").attr("onclick")).split("', '")[1].split("');")[0]
		number_Title[i] = temp2[i].select("span").text()

		if( number_Title[i] == getNum("UOS3_max")-1 ){
			setDB("UOS3_max",getNum("UOS3_max")+1)
			setDB("title_UOS3_"+getDB("UOS3_max"),title[i])
			setDB("Adress_UOS3_"+getDB("UOS3_max"),number_Adress[i])
			i=10;
			check = 1;
		}
		i++;
	}

	if(check==1){ //새로 파싱된 내용이 있을 경우
		str += "학사 공지가 새로 게시되었습니다\n"
		str += getDB("title_UOS3_"+getDB("UOS3_max"))
		str2 += "보러가기 : http://www.uos.ac.kr/korNotice/view.do?list_id=FA2&seq="+getDB("Adress_UOS3_"+getDB("UOS3_max"))+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
		Api.replyRoom("봇장난",str)
		Api.replyRoom("봇장난",str2)
		Api.replyRoom("공지확인방",str)
		Api.replyRoom("공지확인방",str2)
		Api.replyRoom("시갤톡방",str)
		Api.replyRoom("시갤톡방",str2)
		Api.replyRoom("시립대공지확인방",str)
		Api.replyRoom("시립대공지확인방",str2)
	}
}
*/


/*
function parsingUOS3(){
	var str = webRead("http://www.uos.ac.kr/korNotice/view.do?list_id=FA2&seq="+getDB("UOS3max")+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10")
	var title = str.split("<title>")[1].split("</title>")[0].split(" &lt;")[0]
	if(title == "" || title == "MIWIFI" || title == undefined){
		return 0
	}
	else{
		setDB("titleUOS3"+getNum("UOS3max"),title)
		setDB("UOS3max",getNum("UOS3max")+1)
		return 1
	}
}

function UOSP3(){
	var str = ""
	var str2 = ""
	if(parsingUOS3()==1&& getDB("titleUOS3"+(getNum("UOS3max")-1))!=getDB("titleUOS3"+(getNum("UOS3max")-2)) ){
		str += "학사 공지가 새로 게시되었습니다\n"
		str += getDB("titleUOS3"+(getNum("UOS3max")-1))
		str2 += "보러가기 : http://www.uos.ac.kr/korNotice/view.do?list_id=FA2&seq="+(getDB("UOS3max")-1)+"&sort=0&pageIndex=1&searchCnd=&searchWrd=&viewAuth=Y&writeAuth=N&lpageCount=10"
		Api.replyRoom("봇장난",str)
		Api.replyRoom("봇장난",str2)
		Api.replyRoom("공지확인방",str)
		Api.replyRoom("공지확인방",str2)
		setTimeout(Api.replyRoom,["공지확인방2",str],300000)
		setTimeout(Api.replyRoom,["공지확인방2",str2],300000)
		Api.replyRoom("시갤톡방",str)
		Api.replyRoom("시갤톡방",str2)
	}
	else if(parsingUOS3()==1&& getDB("titleUOS"+(getNum("UOS3max")-1))!=getDB("titleUOS"+(getNum("UOS3max")-2)) ){
	}
}
*/

function UOSP4(){ // 장학공지
	var str = ""
	var str2 = ""
	var title = String(org.jsoup.Jsoup.connect("http://scholarship.uos.ac.kr/scholarship/notice/notice/list.do?brdBbsseq=1").get().select('.boardview.notice_title')).split('class="boardview notice_title"> ')[1].split(' </a>')[0]
	if(title == "" || title == "MIWIFI" || title == undefined || title == getDB("titleUOS4_"+getNum("UOS4max")) ){
		return 0
	}
	else{
		setDB("titleUOS4_"+(getNum("UOS4max")+1),title)
		setDB("UOS4max",getNum("UOS4max")+1)
		str += "장학 공지가 새로 게시되었습니다\n"
		str += getDB("titleUOS4_"+(getNum("UOS4max")))
		str2 += "보러가기 : http://scholarship.uos.ac.kr/scholarship/notice/notice/list.do?brdBbsseq=1"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		/*
		sendKalingImage("시갤톡방","","sirip.kr",str,"",0,0)
		sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		*/


		sendKalingImage(UOS_SG_name,
			"",
			"http://scholarship.uos.ac.kr/scholarship/notice/notice/list.do?brdBbsseq=1"
			,str,"보러가기",0,0)

		//sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,
			"",
			"http://scholarship.uos.ac.kr/scholarship/notice/notice/list.do?brdBbsseq=1"
			,str,"보러가기",0,0)
		//sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		/*
		sendKalingImage("시립대공지확인방2",
			"",
			"http://scholarship.uos.ac.kr/scholarship/notice/notice/list.do?brdBbsseq=1"
			,str,"보러가기",0,0)
			*/

		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
	}
}

function UOSP5() { // 취창업공지 (2019_09_25)
	var str = ""
	var str2 = ""
	var title = "" // 새로 파싱된 제목 명
	var temp = 0; // 필독공지가 아닌 최초시점 공지 번호 기록
	var parse = String(org.jsoup.Jsoup.connect("https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV").get())
	var SW_new = 0; // 새로운 공지가 파싱되었을 경우 1이됨

	title = parse.split('<div class="txt"> ')[1].split('"> ')[1].split('</a> ')[0] // 새로 파싱한 제목

	if (title == "" || title == "MIWIFI" || title == undefined) { // 오류일시 종료
		return 0;
	}
	// ECE_last가 371번일 때 새로운 내용이 파싱되면 371번에 기록된다.
	if (getDB("title_UOSP5_" + (getNum("UOSP5_last") - 1)) != title) { // 새로운 내용이 파싱되었을 경우
		setDB("title_UOSP5_" + getDB("UOSP5_last"), title) // 새로 파싱된 내용 DB에 기록
		setDB("UOSP5_last", getNum("UOSP5_last") + 1) // 다음 파싱을 위해 카운트 +1
		SW_new = 1
	}

	if(new Date().getHours()>=9 && new Date().getHours()<=21){ // 새벽시간대 공지 안뜨게 하는 기능
		var timechecker = 1 // 공지 허용
	}
	else{
		var timechecker = 0 // 공지 비허용
	}

	if(SW_new == 1&&timechecker==0){ // 공지가 심야에 올라왔을 경우
		setDB("title_CECE_temp",title)
		setDB("res_CECE","1")
		Api.replyRoom("봇장난", "심야공지 비활성화 작동")
		Api.replyRoom("봇장난","취업창업공지 : "+title)
	}

	if(getDB("res_CECE")==1&&timechecker==1){ // 이전에 밀린 공지가 있었을 경우 아침에 공지
		str += "취업창업 공지가 새로 게시되었습니다\n"
		str += getDB("title_CECE_temp")
		str2 += "보러가기 : https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		/*
		sendKalingImage("시갤톡방","","sirip.kr",str,"",0,0)
		sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		*/


		sendKalingImage(UOS_SG_name,
			"",
			"https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
			,str,"보러가기",0,0)

		//sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,
			"",
			"https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
			,str,"보러가기",0,0)
		//sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		/*
		sendKalingImage("시립대공지확인방2",
			"",
			"https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
			,str,"보러가기",0,0)
			*/

		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
		setDB("res_CECE","0") // 초기화
		Api.replyRoom("봇장난", "심야공지 방송 완료")
		Api.replyRoom("봇장난","취업창업공지 : "+title)
	}

	if (SW_new == 1&&timechecker==1) {
		str += "취업창업 공지가 새로 게시되었습니다\n"
		str += title
		str2 += "보러가기 : https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		/*
		sendKalingImage("시갤톡방","","sirip.kr",str,"",0,0)
		sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		*/

		sendKalingImage(UOS_SG_name,
			"",
			"https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
			,str,"보러가기",0,0)
		//sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,
			"",
			"https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
			,str,"보러가기",0,0)
		//sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		/*
		sendKalingImage("시립대공지확인방2",
			"",
			"https://www.uos.ac.kr/korColumn/list.do?list_id=FA35&epTicket=INV"
			,str,"보러가기",0,0)
			*/


		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
	}
}


//==================== 학과공지 파싱 ================================================================================================================================


function UOSP2() { // 전전컴공지(new) (2019_09_25)
	var str = ""
	var str2 = ""
	var title = "" // 새로 파싱된 제목 명
	var parse = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a").get()
	var SW_new = 0; // 새로운 공지가 파싱되었을 경우 1이됨

	var a = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a").get().select("div.tb-body")
	var b = a.toArray().filter(v=>v.select("li.tb-wid01").text()!="[공지]")
	title = b[0].select("li.tb-wid02").text()


	if (title == "" || title == "MIWIFI" || title == undefined) { // 오류일시 종료
		return 0;
	}
	// ECE_last가 371번일 때 새로운 내용이 파싱되면 371번에 기록된다.
	if (getDB("title_ECE_" + (getNum("ECE_last") - 1)) != title) { // 새로운 내용이 파싱되었을 경우
		setDB("title_ECE_" + getDB("ECE_last"), title) // 새로 파싱된 내용 DB에 기록
		setDB("ECE_last", getNum("ECE_last") + 1) // 다음 파싱을 위해 카운트 +1
		SW_new = 1
	}

	var nyam = 0

	if(new Date().getHours()>=9 && new Date().getHours()<=21){ // 새벽시간대 공지 안뜨게 하는 기능
		var timechecker = 1 // 공지 허용
	}
	else{
		var timechecker = 0 // 공지 비허용
	}

	if(SW_new == 1&&timechecker==0){ // 공지가 심야에 올라왔을 경우
		setDB("title_ECE_temp",title)
		setDB("res_ECE","1")
		Api.replyRoom("봇장난", "심야공지 비활성화 작동")
		Api.replyRoom("봇장난","전전컴공지 : "+title)
	}



	if(getDB("res_ECE")==1&&timechecker==1){ // 이전에 밀린 공지가 있었을 경우 아침에 공지
		str += "전전컴 공지가 새로 게시되었습니다\n"
		str += getDB("title_ECE_temp")
		str2 += "보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		/*
		sendKalingImage("시갤톡방","","sirip.kr",str,"",0,0)
		sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		*/


		sendKalingImage(UOS_SG_name,
			"",
			"보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
			,str,"보러가기",0,0)

		//sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,
			"",
			"보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
			,str,"보러가기",0,0)
		//sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		/*
		sendKalingImage("시립대공지확인방2",
			"",
			"보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
			,str,"보러가기",0,0)
			*/

		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
		setDB("res_ECE","0") // 초기화
		Api.replyRoom("봇장난", "심야공지 방송 완료")
		Api.replyRoom("봇장난","전전컴공지 : "+title)
	}

	if (SW_new == 1&&timechecker==1) { // 일반적인 시간대에 공지가 올라왔을 경우
		str += "전전컴 공지가 새로 게시되었습니다\n"
		str += title
		str2 += "보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		/*
		sendKalingImage("시갤톡방","","sirip.kr",str,"",0,0)
		sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str,"",0,0)
		sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		*/

		sendKalingImage(UOS_SG_name,
			"",
			"보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
			,str,"보러가기",0,0)
		//sendKalingImage("시갤톡방","","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,
			"",
			"보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
			,str,"보러가기",0,0)
		//sendKalingImage("시립대공지확인방","","sirip.kr",str2,"",0,0)
		/*
		sendKalingImage("시립대공지확인방2",
			"",
			"보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
			,str,"보러가기",0,0)
			*/

		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
	}
}

function UOSP2_list(r) {
	var str = ""
	var str2 = ""
	var a = org.jsoup.Jsoup.connect("http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a").get().select("div.tb-body")
	var b = a.toArray().filter(v=>v.select("li.tb-wid01").text()!="[공지]")
	str +=  b.map((v,i)=>(i+1)+". "+v.select("li.tb-wid02").text()).slice(0,10).join("\n")
	str2 += "보러가기 : http://www.uos.ac.kr/engineering/korNotice/allList.do?list_id=20013DA1&cate_id2=000010058#a"
	r.reply(str)
	r.reply(str2)
}

function UOSPKY() { // 경영학과공지 (2019_09_25)
	var str = ""
	var str2 = ""
	var title = "" // 새로 파싱된 제목 명
	//var number = ""// 글번호
	var temp = 0; // 필독공지가 아닌 최초시점 공지 번호 기록
	//var parse = String(org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get())
	var SW_new = 0; // 새로운 공지가 파싱되었을 경우 1이됨

	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	title = org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get().select("ul.listType>li:not(.on)>a").get(0).ownText()
	//number = org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get().select("ul.listType>li:not(.on)>a>span").get(0).text()

	if (title == "" || title == "MIWIFI" || title == undefined) { // 오류일시 종료
		return 0;
	}
	// ECE_last가 371번일 때 새로운 내용이 파싱되면 371번에 기록된다.
	if (getDB("title_KY_" + (getNum("KY_last") - 1)) != title) { // 새로운 내용이 파싱되었을 경우
		setDB("title_KY_" + getDB("KY_last"), title) // 새로 파싱된 내용 DB에 기록
		setDB("KY_last", getNum("KY_last") + 1) // 다음 파싱을 위해 카운트 +1
		SW_new = 1
	}

	if (SW_new == 1) {
		str += "경영학부 공지가 새로 게시되었습니다\n"
		str += title
		str2 += "보러가기 : http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		sendKalingImage(UOS_SG_name,"","sirip.kr",str,"",0,0)
		sendKalingImage(UOS_SG_name,"","sirip.kr",str2,"",0,0)
		sendKalingImage(UOS_notiece_name1,"","sirip.kr",str,"",0,0)
		sendKalingImage(UOS_notiece_name1,"","sirip.kr",str2,"",0,0)
		//sendKalingImage("시립대공지확인방2","","sirip.kr",str,"",0,0)
		//sendKalingImage("시립대공지확인방2","","sirip.kr",str2,"",0,0)
		//Api.replyRoom("시갤톡방", str)
		//Api.replyRoom("시갤톡방", str2)
		//Api.replyRoom("공지확인방", str)
		//Api.replyRoom("공지확인방", str2)
		//Api.replyRoom("시립대공지확인방", str)
		//Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
	}

}

function UOSPKY_list(r) {
	var str = ""
	var str2 = ""
	str += org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get().select("ul.listType>li:not(.on)").toArray().map((v,i)=>(i+1)+". "+v.selectFirst("a").ownText()).join("\n")
	str2 += "보러가기 : http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2"
	r.reply(str)
	r.reply(str2)
}




function corona1(){
	var str = ""

	var temp = org.jsoup.Jsoup.connect("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=&brdGubun=&ncvContSeq=&contSeq=&board_id=&gubun=").get().select("table.num").select("tr").select("td")

	var number1 = temp.get(0).ownText() // 확진자수
	var number2 = temp.get(1).ownText() // 확진자 격리해제
	var number3 = temp.get(2).ownText() // 격리중
	var number4 = temp.get(3).ownText() // 사망

	str += "확진자 : "+number1+"\n";
	str += "사망자 : "+number4+"\n";
	str += "격리중 : "+number3+"\n";
	str += "격리해제 : "+number2+"\n";

	str += org.jsoup.Jsoup.connect("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=&brdGubun=&ncvContSeq=&contSeq=&board_id=&gubun=").get().select(".s_descript").get(0).ownText().replace("&nbsp;"," ").replace("코로나바이러스감염증-19 국내 발생 현황","")

	return str;

}

function corona2(){
	var a = org.jsoup.Jsoup.connect("http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=14&ncvContSeq=&contSeq=&board_id=&gubun=").get().select(".num").get(3).select("tbody").select("tr").toArray().filter(v=>v.select("td").size()==2).map(v=>({
		region:String(v.select("td").get(0).text()),
		data:String(v.select("td").get(1).text()),
		num:Number(/([\d,]+)명/.exec(String(v.select("td").get(1).text()))[1].replace(/,/g,""))

	}))

	var str = a.sort((x,y)=>y.num-x.num).map(v=>v.region +" : "+v.data).join("\n")

	return str;

}



function UOSP_corona() { // 코로나 공지 (2020_03_05)
	var str = ""
	var str2 = ""
	var title = "" // 새로 파싱된 제목 명
	//var number = ""// 글번호
	var temp = 0; // 필독공지가 아닌 최초시점 공지 번호 기록
	//var parse = String(org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get())
	var SW_new = 0; // 새로운 공지가 파싱되었을 경우 1이됨

	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://www.uos.ac.kr/korNotice/list.do?list_id=corona19&epTicket=ST-505552-HHXaokSuh2rOMXMvfUecLRQYfmA3dtwJ7oj-21").get().select("ul.listType>li:not(.on)>a").get(0)
	title = parse.ownText()
	adress = parse.attr("onclick").split("'")[3]
	//title = org.jsoup.Jsoup.connect("https://www.uos.ac.kr/korNotice/list.do?list_id=corona19&epTicket=ST-505552-HHXaokSuh2rOMXMvfUecLRQYfmA3dtwJ7oj-21").get().select("ul.listType>li:not(.on)>a").get(0).ownText()
	//number = org.jsoup.Jsoup.connect("http://biz.uos.ac.kr/korNotice/list.do?list_id=20008N2").get().select("ul.listType>li:not(.on)>a>span").get(0).text()

	if (title == "" || title == "MIWIFI" || title == undefined) { // 오류일시 종료
		return 0;
	}
	// ECE_last가 371번일 때 새로운 내용이 파싱되면 371번에 기록된다.
	if (getDB("title_corona_" + (getNum("corona_last") - 1)) != title) { // 새로운 내용이 파싱되었을 경우
		setDB("title_corona_" + getDB("corona_last"), title) // 새로 파싱된 내용 DB에 기록
		setDB("corona_last", getNum("corona_last") + 1) // 다음 파싱을 위해 카운트 +1
		SW_new = 1
	}

	if (SW_new == 1) {
		str += "코로나19 공지가 새로 게시되었습니다\n"
		str += title
		str2 += "보러가기 : " + "https://www.uos.ac.kr/korNotice/view.do?list_id=corona19&seq="+adress+"&sort=2&pageIndex=1&searchCnd=&searchWrd=&cate_id=&viewAuth=Y&writeAuth=Y&board_list_num=10&lpageCount=10&epTicket=ST-505588-00IHJls6293UMfzCtbloZyqBBONux9dIKhg-21"
		//Api.replyRoom("봇장난", str)
		//Api.replyRoom("봇장난", str2)
		Api.replyRoom("시갤톡방", str)
		Api.replyRoom("시갤톡방", str2)
		Api.replyRoom("공지확인방", str)
		Api.replyRoom("공지확인방", str2)
		Api.replyRoom("시립대공지확인방", str)
		Api.replyRoom("시립대공지확인방", str2)
		//Api.replyRoom("시립대공지확인방2", str)
		//Api.replyRoom("시립대공지확인방2", str2)
	}

}

function UOSPcorona_list(r) {
	var str = ""
	var str2 = ""
	str += org.jsoup.Jsoup.connect("https://www.uos.ac.kr/korNotice/list.do?list_id=corona19&epTicket=ST-505552-HHXaokSuh2rOMXMvfUecLRQYfmA3dtwJ7oj-21").get().select("ul.listType>li:not(.on)").toArray().map((v,i)=>(i+1)+". "+v.selectFirst("a").ownText()).join("\n")
	str2 += "보러가기 : https://www.uos.ac.kr/korNotice/list.do?list_id=corona19&epTicket=ST-505552-HHXaokSuh2rOMXMvfUecLRQYfmA3dtwJ7oj-21"
	r.reply(str)
	r.reply(str2)
}






function parsingSG_text(number){ // 해당 글번호에 해당하는 글 파싱
	var str = webRead("http://m.dcinside.com/view.php?id=exam_new&no="+number+"&page=1&serVal=자이하르&s_type=name&ser_pos=","mobile")
	var write = str.split("<table style=\"table-layout: fixed; width: 100%\"><tbody><tr><td>")[1].split("</td></tr></tbody></table>")[0]
	write = write.replace(/<br[^\/]+\/>/g,"\n") // 글 내용
	write = write.replace(/^[\n\s]+/g,"")
	var time = str.split("<span class=\"nick_comm flow\"></span>")[1].split("<span>")[1].split("</span>")[0] // 시간
	var title = str.split("<span class=\"tit_view\">")[1].split("<span class=\"img_comm ico_mobile\"></span>")[0] // 제목

	var strF = number + "||" + time + "||" + title + "||" + write

	setZDB ( "ZYHR"+getZDB("ZCount") , strF )
	setZDB ( "ZCount" , getZNum("ZCount")+1 )

}

function parsingSG(){ //
	var str = webRead("http://m.dcinside.com/list.php?serVal=자이하르&id=exam_new&s_type=name","mobile")
	var i=16
	var Num = str.split("<a href=\"http://m.dcinside.com/view.php?id=exam_new&no=")[i].split("&page=1&serVal=자이하르&s_type=name&ser_pos=\">")[0]

	while(1){
		if( Num <= getZNum("maxNumber") ){ // 넘기기
			i--
			Num = str.split("<a href=\"http://m.dcinside.com/view.php?id=exam_new&no=")[i].split("&page=1&serVal=자이하르&s_type=name&ser_pos=\">")[0]

		}
		else if( Num > getZNum("maxNumber") ){ // 새글이 등록된 경우
			parsingSG_text(Num)
			setZDB("maxNumber",Num)
			i--
			Num = str.split("<a href=\"http://m.dcinside.com/view.php?id=exam_new&no=")[i].split("&page=1&serVal=자이하르&s_type=name&ser_pos=\">")[0]

		}
		else if (i==1){
			break
		}
	}

}

function searchZYHR(number){
	var i = 0
	var temp = ""
	var str = ""
	while(i<getZNum("ZCount")+1){
		temp = getZDB("ZYHR"+i)
		if(temp.split("||")[0]==number){
			Api.replyRoom("봇장난",temp.split("||")[3].replaceAmp())
			break
		}
		i++
	}
}



function haksik(hdate){

	var parse = String(org.jsoup.Jsoup.connect("http://www.uos.ac.kr/food/placeList.do?search_date="+hdate).get())

	var str = ""
	str += "---점심---\n"
	//str += webRead("http://www.uos.ac.kr/food/placeList.do?search_date="+hdate).split("<td class=\"al\">")[2].split("<br/>")[0].replace(/<br>/g,"\n")
	str += parse.split("<td class=\"al\">")[2].split("<br/>")[0].replace(/<br>/g,"\n")

	str += "---저녁---\n"
	//str += webRead("http://www.uos.ac.kr/food/placeList.do?search_date="+hdate).split("<td class=\"al\">")[3].split("<br/>")[0].replace(/<br>/g,"\n")
	str += parse.split("<td class=\"al\">")[3].split("<br/>")[0].replace(/<br>/g,"\n")

	return str
}

//======================================================================================================================
//======================================================================================================================
//======================================================================================================================



//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

function UOSdate(){
	var page = "http://wise.uos.ac.kr/uosdoc/api.ApiApiMainBd.oapi?apiKey=201808506NVF93269"
	var number = Number(String(org.jsoup.Jsoup.connect(page).get()).split('</schList>')[0].split('<list>').length)
	var content = []
	var date = []
	var str = ""
	for(var i=1 ; i<number ; i++){
		content[i-1] = String(org.jsoup.Jsoup.connect(page).get()).split('</schList>')[0].split('<list>')[i].split('<content><![CDATA[')[1].split(']]>')[0]
		date[i-1] = String(org.jsoup.Jsoup.connect(page).get()).split('</schList>')[0].split('<list>')[i].split('<content><![CDATA[')[1].split('<sch_date><![CDATA[')[1].split(']]>')[0]
		str += content[i-1] + " : " + date[i-1] + "\n"
	}
	return str
}

function UOSTime(year,term,subject,action){

	// action 1 : 교과목명, 교과번호 분반명, 교수이름


	var apiKey = "201808506NVF93269"
	// year
	// term A10 : 1학기, A20 : 2학기
	// subject
	var URL = "http://wise.uos.ac.kr/uosdoc/api.ApiApiSubjectList.oapi?apiKey="+apiKey+"&year="+year+"&term="+term+"&subjectNm="+subject
	var strLength = org.jsoup.Jsoup.connect(URL).get().select("subject_nm").toArray().length

	var result_SubjectNo = []; // 과목 번호
	var result_SubjectNm = []; // 과목명 출력
	var result_ClassDiv = []; // 과목 분반
	var result_SubjectDiv = []; // 과목 전필, 전선 여부
	var result_Dept = []; // 학과
	var result_Prof = []; // 교수명

	var str = ""

	for(var i=0 ; i< strLength ; i++){
		result_SubjectNo[i] = String(org.jsoup.Jsoup.connect(URL).get().select("subject_no").toArray()[i]).split('<![CDATA[')[1].split(']]>')[0]
		result_SubjectNm[i]  = String(org.jsoup.Jsoup.connect(URL).get().select("subject_nm").toArray()[i]).split('<![CDATA[')[1].split(']]>')[0]
		result_ClassDiv[i]  = String(org.jsoup.Jsoup.connect(URL).get().select("class_div").toArray()[i]).split('<![CDATA[')[1].split(']]>')[0]
		result_SubjectDiv[i]  = String(org.jsoup.Jsoup.connect(URL).get().select("subject_div").toArray()[i]).split('<![CDATA[')[1].split(']]>')[0]
		result_Dept[i]  = String(org.jsoup.Jsoup.connect(URL).get().select("dept").toArray()[i]).split('<![CDATA[')[1].split(']]>')[0]
		result_Prof[i]  = String(org.jsoup.Jsoup.connect(URL).get().select("prof_nm").toArray()[i]).split('<![CDATA[')[1].split(']]>')[0]
		//str += result_SubjectNo[i]+result_SubjectNm[i]+result_ClassDiv[i]+result_SubjectDiv[i]+result_Dept[i]+result_Prof[i]+"\n"
	}

	if(action==1){
		for(var i=0 ; i< strLength ; i++){
			str += (i+1)+"."+result_SubjectNm[i]+"("+result_Prof[i]+"교수님):"+result_SubjectNo[i]+"("+result_ClassDiv[i]+"분반)\n"
		}
	}

	return str;

}

//=====================================================================================================================================
//======================================================== 주식 레이어 ===============================================================
//=====================================================================================================================================

function WTI_parse() { // WTI 파싱 (2020_04_12)
	var str = [];
	var price = "" // 가격
	var UpDownPercent = "" // 가격 등락 퍼센트
	var UpDownPrice = "" // 가격 등락 값
	var yesterday_price = "" // 전일 종가
	var today_price = "" // 금일 시가
	var low = "" // 금일 저가
	var high = "" // 금일 고가
	var parse = "";


	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://kr.investing.com/commodities/crude-oil").get()
	price = parse.select(".float_lang_base_1.bold>#fl_header_pair_lst").get(0).ownText()
	UpDownPrice = parse.select(".float_lang_base_1.bold>#fl_header_pair_chg").get(0).ownText()
	UpDownPercent = parse.select(".float_lang_base_1.bold>#fl_header_pair_pch").get(0).ownText()
	yesterday_price = parse.select("#quotes_summary_secondary_data span[dir=ltr]").get(0).ownText()
	today_price = parse.select("#quotes_summary_secondary_data span[dir=ltr]").get(1).ownText()
	low = parse.select("#quotes_summary_secondary_data .inlineblock").get(0).ownText()
	high = parse.select("#quotes_summary_secondary_data .inlineblock").get(1).ownText()

	str[0] = "현재 유가 : "+price+"$ ("+UpDownPrice+"$, "+UpDownPercent+")\n"
	str[0] += "금일 시가 : "+today_price+"$ ("+low+"$-"+high+"$)\n"
	str[0] += "전일 종가 : "+yesterday_price+"$"

	var parse2 = "";

	str[1] = "";

	parse2 = org.jsoup.Jsoup.connect("https://kr.investing.com/commodities/crude-oil-contracts").get()

	var name2 = [];
	var price2 = [];
	var var2 = [];
	var open2 = [];
	var high2 = [];
	var low2 = [];
	var updown2 = [];

	var temp = ""
	var monthSet = {Jan:"㋀",Feb:"㋁",Mar:"㋂",Apr:"㋃",May:"㋄",Jun:"㋅",Jul:"㋆",Aug:"㋇",Sep:"㋈",Oct:"㋉",Nov:"㋊",Dec:"㋋"};


	for(var i=0 ; i<10 ; i++){
		//WTI2_name[i] = parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]
		name2[i] = monthSet[parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]] || "現"
		temp = parse2.select("tr#pair_"+(i+1)+">td")
		price2[i] = temp.get(2).ownText().replace("s","")
		var2[i] = temp.get(3).ownText()

		updown2[i] = (var2[i].substr(0,1)=="+")?"⬆":"⬇";


		open2[i] = temp.get(4).ownText()
		high2[i] = temp.get(5).ownText()
		low2[i] = temp.get(6).ownText()
		str[1] += name2[i] + " : " + price2[i]+"$ ("+low2[i]+"$-"+high2[i]+"$)"+updown2[i]+"\n"
	}


	var date = new Date()
	var date_re = String(date.getYear()+1900) + String(date.getMonth()+1).date() + String(date.getDate()).date() +
		String(date.getHours()).date() + String(date.getMinutes()).date()


	str[2] = "https://t1.daumcdn.net/finance/chart/kr/commodity/m/mini/CLc1.png?timestamp="+date_re






	return str
}



function natural_Gas_parse() { // 천연가스 파싱 (2020_05_17)
	var str = [];
	var price = "" // 가격
	var UpDownPercent = "" // 가격 등락 퍼센트
	var UpDownPrice = "" // 가격 등락 값
	var yesterday_price = "" // 전일 종가
	var today_price = "" // 금일 시가
	var low = "" // 금일 저가
	var high = "" // 금일 고가
	var parse = "";


	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://kr.investing.com/commodities/natural-gas").get()
	price = parse.select(".float_lang_base_1.bold>#fl_header_pair_lst").get(0).ownText()
	UpDownPrice = parse.select(".float_lang_base_1.bold>#fl_header_pair_chg").get(0).ownText()
	UpDownPercent = parse.select(".float_lang_base_1.bold>#fl_header_pair_pch").get(0).ownText()
	yesterday_price = parse.select("#quotes_summary_secondary_data span[dir=ltr]").get(0).ownText()
	today_price = parse.select("#quotes_summary_secondary_data span[dir=ltr]").get(1).ownText()
	low = parse.select("#quotes_summary_secondary_data .inlineblock").get(0).ownText()
	high = parse.select("#quotes_summary_secondary_data .inlineblock").get(1).ownText()

	str[0] = "현재 천연가스 : "+price+"$ ("+UpDownPrice+"$, "+UpDownPercent+")\n"
	str[0] += "금일 시가 : "+today_price+"$ ("+low+"$-"+high+"$)\n"
	str[0] += "전일 종가 : "+yesterday_price+"$"

	var parse2 = "";

	str[1] = "";

	parse2 = org.jsoup.Jsoup.connect("https://kr.investing.com/commodities/natural-gas-contracts").get()

	var name2 = [];
	var price2 = [];
	var var2 = [];
	var open2 = [];
	var high2 = [];
	var low2 = [];
	var updown2 = [];

	var temp = ""
	var monthSet = {Jan:"㋀",Feb:"㋁",Mar:"㋂",Apr:"㋃",May:"㋄",Jun:"㋅",Jul:"㋆",Aug:"㋇",Sep:"㋈",Oct:"㋉",Nov:"㋊",Dec:"㋋"};


	for(var i=0 ; i<10 ; i++){
		//WTI2_name[i] = parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]
		name2[i] = monthSet[parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]] || "現"
		temp = parse2.select("tr#pair_"+(i+1)+">td")
		price2[i] = temp.get(2).ownText().replace("s","")
		var2[i] = temp.get(3).ownText()

		updown2[i] = (var2[i].substr(0,1)=="+")?"⬆":"⬇";


		open2[i] = temp.get(4).ownText()
		high2[i] = temp.get(5).ownText()
		low2[i] = temp.get(6).ownText()
		str[1] += name2[i] + " : " + price2[i]+"$ ("+low2[i]+"$-"+high2[i]+"$)"+updown2[i]+"\n"
	}

	/*
	var date = new Date()
	var date_re = String(date.getYear()+1900) + String(date.getMonth()+1).date() + String(date.getDate()).date() +
		String(date.getHours()).date() + String(date.getMinutes()).date()
		*/

	str[2] = "https://ssl.pstatic.net/imgfinance/chart/mobile/marketindex/month3/CMDT_NG_end.png?sidcode=1589691842800"






	return str
}

function Gold_parse() { // 금 파싱 (2020_05_17)
	var str = [];
	var price = "" // 가격
	var UpDownPercent = "" // 가격 등락 퍼센트
	var UpDownPrice = "" // 가격 등락 값
	var yesterday_price = "" // 전일 종가
	var today_price = "" // 금일 시가
	var low = "" // 금일 저가
	var high = "" // 금일 고가
	var parse = "";


	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://kr.investing.com/commodities/gold").get()
	price = parse.select(".float_lang_base_1.bold>#fl_header_pair_lst").get(0).ownText()
	UpDownPrice = parse.select(".float_lang_base_1.bold>#fl_header_pair_chg").get(0).ownText()
	UpDownPercent = parse.select(".float_lang_base_1.bold>#fl_header_pair_pch").get(0).ownText()
	yesterday_price = parse.select("#quotes_summary_secondary_data span[dir=ltr]").get(0).ownText()
	today_price = parse.select("#quotes_summary_secondary_data span[dir=ltr]").get(1).ownText()
	low = parse.select("#quotes_summary_secondary_data .inlineblock").get(0).ownText()
	high = parse.select("#quotes_summary_secondary_data .inlineblock").get(1).ownText()

	str[0] = "현재 금 : "+price+"$ ("+UpDownPrice+"$, "+UpDownPercent+")\n"
	str[0] += "금일 시가 : "+today_price+"$ ("+low+"$-"+high+"$)\n"
	str[0] += "전일 종가 : "+yesterday_price+"$"

	var parse2 = "";

	str[1] = "";

	parse2 = org.jsoup.Jsoup.connect("https://kr.investing.com/commodities/gold-contracts").get()

	var name2 = [];
	var price2 = [];
	var var2 = [];
	var open2 = [];
	var high2 = [];
	var low2 = [];
	var updown2 = [];

	var temp = ""
	var monthSet = {Jan:"㋀",Feb:"㋁",Mar:"㋂",Apr:"㋃",May:"㋄",Jun:"㋅",Jul:"㋆",Aug:"㋇",Sep:"㋈",Oct:"㋉",Nov:"㋊",Dec:"㋋"};


	for(var i=0 ; i<10 ; i++){
		//WTI2_name[i] = parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]
		name2[i] = monthSet[parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]] || "現"
		temp = parse2.select("tr#pair_"+(i+1)+">td")
		price2[i] = temp.get(2).ownText().replace("s","")
		var2[i] = temp.get(3).ownText()

		updown2[i] = (var2[i].substr(0,1)=="+")?"⬆":"⬇";


		open2[i] = temp.get(4).ownText()
		high2[i] = temp.get(5).ownText()
		low2[i] = temp.get(6).ownText()
		str[1] += name2[i] + " : " + price2[i]+"$ ("+low2[i]+"$-"+high2[i]+"$)"+updown2[i]+"\n"
	}

	/*
	var date = new Date()
	var date_re = String(date.getYear()+1900) + String(date.getMonth()+1).date() + String(date.getDate()).date() +
		String(date.getHours()).date() + String(date.getMinutes()).date()
		*/

	str[2] = "https://ssl.pstatic.net/imgfinance/chart/mobile/marketindex/month3/CMDT_GC_end.png?sidcode=1589693221845"






	return str
}

function USD_parse() { // 달러 파싱 (2020_05_17)
	var str = [];
	var price = "" // 가격
	var UpDownPercent = "" // 가격 등락 퍼센트
	var UpDownPrice = "" // 가격 등락 값
	var yesterday_price = "" // 전일 종가
	var today_price = "" // 금일 시가
	var low = "" // 금일 저가
	var high = "" // 금일 고가
	var parse = "";


	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://kr.investing.com/currencies/usd-krw").get()
	price = parse.select(".float_lang_base_1.bold>#fl_header_pair_lst").get(0).ownText()
	UpDownPrice = parse.select(".float_lang_base_1.bold>#fl_header_pair_chg").get(0).ownText()
	UpDownPercent = parse.select(".float_lang_base_1.bold>#fl_header_pair_pch").get(0).ownText()
	yesterday_price = parse.select("#quotes_summary_secondary_data span[dir=ltr]").get(0).ownText()
	today_price = parse.select(".first>.float_lang_base_2").get(1).ownText()
	low = parse.select("#quotes_summary_secondary_data .inlineblock").get(0).ownText()
	high = parse.select("#quotes_summary_secondary_data .inlineblock").get(1).ownText()

	str[0] = "현재 달러 : "+price+"₩ ("+UpDownPrice+"₩, "+UpDownPercent+")\n"
	str[0] += "금일 시가 : "+today_price+"₩ ("+low+"₩-"+high+"₩)\n"
	str[0] += "전일 종가 : "+yesterday_price+"₩"

	/*
	var parse2 = "";

	str[1] = "";

	parse2 = org.jsoup.Jsoup.connect("https://kr.investing.com/commodities/gold-contracts").get()

	var name2 = [];
	var price2 = [];
	var var2 = [];
	var open2 = [];
	var high2 = [];
	var low2 = [];
	var updown2 = [];

	var temp = ""
	var monthSet = {Jan:"㋀",Feb:"㋁",Mar:"㋂",Apr:"㋃",May:"㋄",Jun:"㋅",Jul:"㋆",Aug:"㋇",Sep:"㋈",Oct:"㋉",Nov:"㋊",Dec:"㋋"};


	for(var i=0 ; i<10 ; i++){
		//WTI2_name[i] = parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]
		name2[i] = monthSet[parse2.select("tr#pair_"+(i+1)+">td.bold.left.noWrap>a").get(0).ownText().split(" ")[0]] || "現"
		temp = parse2.select("tr#pair_"+(i+1)+">td")
		price2[i] = temp.get(2).ownText().replace("s","")
		var2[i] = temp.get(3).ownText()

		updown2[i] = (var2[i].substr(0,1)=="+")?"⬆":"⬇";


		open2[i] = temp.get(4).ownText()
		high2[i] = temp.get(5).ownText()
		low2[i] = temp.get(6).ownText()
		str[1] += name2[i] + " : " + price2[i]+"$ ("+low2[i]+"$-"+high2[i]+"$)"+updown2[i]+"\n"
	}

	/!*
	var date = new Date()
	var date_re = String(date.getYear()+1900) + String(date.getMonth()+1).date() + String(date.getDate()).date() +
		String(date.getHours()).date() + String(date.getMinutes()).date()
		*!/
*/
	str[1] = ""
	str[2] = "https://ssl.pstatic.net/imgfinance/chart/mobile/marketindex/month3/FX_USDKRW_end.png?sidcode=1589693806279"






	return str
}

function NASDAQ_parse() { // 나스닥 파싱 (2020_04_16)
	var str = ""
	var price = "" // 가격
	var UpDownPercent = "" // 등락률
	var UpDownPrice = "" // 등락가
	var yesterday_price = "" // 전일 종가
	var today_price = "" // 금일 시가
	var low = "" // 금일 저가
	var high = "" // 금일 고가
	var parse = "";
	var years = ""; // 연간 범위
	var yearsPercent = ""; // 연간 등락률


	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/nasdaq-composite").get()
	price = parse.select(".arial_26").get(0).ownText()
	UpDownPrice = parse.select(".arial_20").get(0).ownText()
	UpDownPercent = parse.select(".arial_20").get(1).ownText()
	yesterday_price = parse.select(".clear.overviewDataTAble>.inlineblock>.float_lang_base_2").get(0).ownText()
	today_price = parse.select(".bottomText").get(0).select("span[dir=ltr]").get(1).ownText()
	low = parse.select(".bottomText").select(".inlineblock").get(1).ownText() // 금일 저가
	high = parse.select(".bottomText").select(".inlineblock").get(2).ownText() // 금일 고가
	years = parse.select(".clear.overviewDataTAble>.inlineblock>.float_lang_base_2").get(5).ownText()
	yearsPercent = parse.select(".clear.overviewDataTAble>.inlineblock>.float_lang_base_2").get(6).ownText()

	str = "현재 나스닥 : "+price+" ("+UpDownPrice+", "+UpDownPercent+")\n"
	str += "금일 시가 : "+today_price+" ("+low+"-"+high+")\n"
	str += "전일 종가 : "+yesterday_price+"\n"
	str += "52주 가격 : "+years+" ("+yearsPercent+")"

	return str
}



function KOSPI_parse() { // 파싱 일반화
	var str = ""
	var price = "" // 가격
	var UpDownPercent = "" // 등락률
	var UpDownPrice = "" // 등락가
	var yesterday_price = "" // 전일 종가
	var today_price = "" // 금일 시가
	var low = "" // 금일 저가
	var high = "" // 금일 고가
	var parse = "";
	var years = ""; // 연간 범위
	var yearsPercent = ""; // 연간 등락률


	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://www.investing.com/indices/korea-200-futures").get()
	price = parse.select(".arial_26").get(0).ownText()
	UpDownPrice = parse.select(".arial_20").get(0).ownText()
	UpDownPercent = parse.select(".arial_20").get(1).ownText()
	yesterday_price = parse.select(".bottomText").get(0).select("span[dir=ltr]").get(0).ownText()
	today_price = parse.select(".bottomText").get(0).select("span[dir=ltr]").get(1).ownText()
	low = parse.select(".inlineblock.pid-8874-low").get(0).ownText()
	high = parse.select(".inlineblock.pid-8874-high").get(0).ownText()
	years = parse.select(".first.inlineblock>.float_lang_base_2").get(3).ownText()
	yearsPercent = parse.select(".first.inlineblock>.float_lang_base_2").get(4).ownText()

	str = "현재 코스피 : "+price+" ("+UpDownPrice+", "+UpDownPercent+")\n"
	str += "금일 시가 : "+today_price+" ("+low+"-"+high+")\n"
	str += "전일 종가 : "+yesterday_price+"\n"
	str += "52주 가격 : "+years+" ("+yearsPercent+")"

	return str
}

function NASDAQ_pre_parse() { // 나스닥 파싱 (2020_04_16)
	var str = ""
	var price = "" // 가격
	var UpDownPercent = "" // 등락률
	var UpDownPrice = "" // 등락가
	var yesterday_price = "" // 전일 종가
	var today_price = "" // 금일 시가
	var low = "" // 금일 저가
	var high = "" // 금일 고가
	var parse = "";


	//split 코드를 퇴출시킵시다. (전국 split 퇴출본부 전스퇴)
	//title = parse.split('<!-- 일반 -->')[1].split('<span class="mhide">')[1].split('</span>')[1].split('</a>')[0] // 새로 파싱한 제목
	parse = org.jsoup.Jsoup.connect("https://www.investing.com/indices/nq-100-futures").get()
	price = parse.select(".arial_26").get(0).ownText()
	UpDownPrice = parse.select(".arial_20").get(0).ownText()
	UpDownPercent = parse.select(".arial_20").get(1).ownText()
	yesterday_price = parse.select(".bottomText").get(0).select("span[dir=ltr]").get(0).ownText()
	today_price = parse.select(".bottomText").get(0).select("span[dir=ltr]").get(1).ownText()
	low = parse.select(".inlineblock.pid-8874-low").get(0).ownText()
	high = parse.select(".inlineblock.pid-8874-high").get(0).ownText()

	str = "현재 나스닥 : "+price+" ("+UpDownPrice+", "+UpDownPercent+")\n"
	str += "금일 시가 : "+today_price+" ("+low+"-"+high+")\n"
	str += "전일 종가 : "+yesterday_price+""

	return str
}

function KOSPI_periodic(){ //코스피 파싱 (2020_05_09) 스레드 삽입용
	return org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kospi").get().select(".top.bold.inlineblock>.arial_20").get(1).ownText().replace("%","")
}


function KOSPI_control(){ //코스피 알리미 기능 (2020_05_09)

	var var_percent = KOSPI_periodic()
	var diff = KOSPI_reference-var_percent

	if( Math.abs(diff) >= 0.2 ){
		date = new Date();
		var arrow = (diff<0)?"⬆":"⬇";
		KOSPI_log = (KOSPI_log+arrow).substr(-12)
		var KOSPI_current = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kospi").get().select(".top.bold.inlineblock>.arial_26.inlineblock.pid-37426-last").get(0).ownText().replace("%","")
		var str = "[ "+date.getHours()+" : "+date.getMinutes()+" | "+var_percent+"% "+arrow+" ]\n" +
			": KOSPI / "+KOSPI_current+" / "+arrow+"\n" +
			"================\n"+KOSPI_log

		KOSPI_reference = Math.round(var_percent*5)/5;
		Api.replyRoom("웅앙농장",str)
		Api.replyRoom("시립주식",str)
	}
}

function KOSPI_periodic_parse(){ // 코스피 실시간 알리미 2020_05_13

	var var_percent = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kospi").get().select(".top.bold.inlineblock>.arial_20").get(1).ownText().replace("%","")
	var diff = KOSPI_reference-var_percent

	if( Math.abs(diff) >= 0.2 ){
		date = new Date();
		var arrow = (diff<0)?"⬆":"⬇";
		KOSPI_log = (KOSPI_log+arrow).substr(-12)
		var KOSPI_current = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kospi").get().select(".top.bold.inlineblock>.arial_26").get(0).ownText()

		KOSPI_reference = Math.round(var_percent*5)/5;
		var date_re = String(date.getYear()+1900) + String(date.getMonth()+1).date() + String(date.getDate()).date() +
			String(date.getHours()).date() + String(date.getMinutes()).date()
		sendKalingImage("시립주식","https://t1.daumcdn.net/finance/chart/kr/stock/d/D0011001.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+KOSPI_current+" | "+var_percent+"%\n===============================\n"+KOSPI_log,"KOSPI",996,519)
		sendKalingImage("웅앙농장","https://t1.daumcdn.net/finance/chart/kr/stock/d/D0011001.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+KOSPI_current+" | "+var_percent+"%\n===============================\n"+KOSPI_log,"KOSPI",996,519)


	}

}


function NASDAQ_periodic(){ //나스닥 파싱 (2020_05_09) 스레드 삽입용
	return org.jsoup.Jsoup.connect("https://kr.investing.com/indices/nq-100").get().select(".top.bold.inlineblock>.arial_20").get(1).ownText().replace("%","")
}

function NASDAQ_control(){ //나스닥 알리미 기능 (2020_05_09)

	var var_percent = NASDAQ_periodic()
	var diff = NASDAQ_reference-var_percent

	if( Math.abs(diff) >= 0.2 ){
		date = new Date();
		var arrow = (diff<0)?"⬆":"⬇";
		NASDAQ_log = (NASDAQ_log+arrow).substr(-12)
		var NASDAQ_current = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/nq-100").get().select(".top.bold.inlineblock>.arial_26.pid-20-last").get(0).ownText()
		var str = "[ "+date.getHours()+" : "+date.getMinutes()+" | "+var_percent+"% "+arrow+" ]\n" +
			": NASDAQ / "+NASDAQ_current+" / "+arrow+"\n" +
			"================\n"+NASDAQ_log

		NASDAQ_reference = Math.round(var_percent*5)/5;
		Api.replyRoom("웅앙농장",str)
		Api.replyRoom("시립주식",str)
	}
}


function NASDAQ_periodic_parse(){ // 나스닥 실시간 알리미 2020_05_13

	var temp = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/nasdaq-composite").get()
	var var_percent = temp.select(".top.bold.inlineblock>.arial_20").get(1).ownText().replace("%","")
	var diff = NASDAQ_reference-var_percent

	if( Math.abs(diff) >= 0.2 ){
		date = new Date();
		var arrow = (diff<0)?"⬆":"⬇";
		NASDAQ_log = (NASDAQ_log+arrow).substr(-12)
		var NASDAQ_current = temp.select(".top.bold.inlineblock>.arial_26").get(0).ownText()
		var str = "[ "+date.getHours()+" : "+date.getMinutes()+" | "+var_percent+"% "+arrow+" ]\n" +
			": NASDAQ / "+NASDAQ_current+" / "+arrow+"\n" +
			"==========\n"+NASDAQ_log

		var NASDAQ_low = temp.select(".bottomText").select(".inlineblock").get(1).ownText() // 금일 저가
		var NASDAQ_high = temp.select(".bottomText").select(".inlineblock").get(2).ownText() // 금일 고가

		NASDAQ_reference = Math.round(var_percent*5)/5;
		var date_re = String(date.getYear()+1900) + String(date.getMonth()+1).date() + String(date.getDate()).date() +
			String(date.getHours()).date() + String(date.getMinutes()).date()
			/*
		sendKalingImage("시립주식","https://t1.daumcdn.net/finance/chart/us/stock/d/COMP.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+NASDAQ_current+" | "+var_percent+"%\n===============================\n"+NASDAQ_log,"NASDAQ 종합(test)",996,519)
		sendKalingImage("웅앙농장","https://t1.daumcdn.net/finance/chart/us/stock/d/COMP.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+NASDAQ_current+" | "+var_percent+"%\n===============================\n"+NASDAQ_log,"NASDAQ 종합(test)",996,519)
			*/
		sendKalingImage("시립주식","https://t1.daumcdn.net/finance/chart/us/stock/d/COMP.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+NASDAQ_current+" | "+var_percent+"% ("+NASDAQ_low+"~"+NASDAQ_high+")\n(이미지 15분 딜레이 존재)","NASDAQ 종합",996,519)
		sendKalingImage("웅앙농장","https://t1.daumcdn.net/finance/chart/us/stock/d/COMP.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+NASDAQ_current+" | "+var_percent+"% ("+NASDAQ_low+"~"+NASDAQ_high+")\n(이미지 15분 딜레이 존재)","NASDAQ 종합",996,519)
	}

}


function KOSDAQ_periodic(){ //코스피 파싱 (2020_05_09) 스레드 삽입용
	return org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kosdaq").get().select(".top.bold.inlineblock>.arial_20").get(1).ownText().replace("%","")
	// nyam
}

function KOSDAQ_control(){ //코스닥 알리미 기능 (2020_05_11)

	var var_percent = KOSDAQ_periodic()
	var diff = KOSDAQ_reference-var_percent

	if( Math.abs(diff) >= 0.2 ){
		date = new Date();
		var arrow = (diff<0)?"⬆":"⬇";
		KOSDAQ_log = (KOSDAQ_log+arrow).substr(-12)
		var KOSDAQ_current = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kosdaq").get().select(".top.bold.inlineblock>.arial_26").get(0).ownText()
		var str = "[ "+date.getHours()+" : "+date.getMinutes()+" | "+var_percent+"% "+arrow+" ]\n" +
			": KOSDAQ / "+KOSDAQ_current+" / "+arrow+"\n" +
			"================\n"+KOSDAQ_log

		KOSDAQ_reference = Math.round(var_percent*5)/5;
		Api.replyRoom("웅앙농장",str)
		Api.replyRoom("시립주식",str)
	}


}

function KOSDAQ_periodic_parse(){ // 코스닥 실시간 알리미 2020_05_13

	var var_percent = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kosdaq").get().select(".top.bold.inlineblock>.arial_20").get(1).ownText().replace("%","")
	var diff = KOSDAQ_reference-var_percent

	if( Math.abs(diff) >= 0.2 ){
		date = new Date();
		var arrow = (diff<0)?"⬆":"⬇";
		KOSDAQ_log = (KOSDAQ_log+arrow).substr(-12)
		var KOSDAQ_current = org.jsoup.Jsoup.connect("https://kr.investing.com/indices/kosdaq").get().select(".top.bold.inlineblock>.arial_26").get(0).ownText()

		KOSDAQ_reference = Math.round(var_percent*5)/5;
		var date_re = String(date.getYear()+1900) + String(date.getMonth()+1).date() + String(date.getDate()).date() +
			String(date.getHours()).date() + String(date.getMinutes()).date()
		sendKalingImage("시립주식","https://t1.daumcdn.net/finance/chart/kr/stock/d/E4012001.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+KOSDAQ_current+" | "+var_percent+"%\n===============================\n"+KOSDAQ_log,"KOSDAQ",996,519)
		sendKalingImage("웅앙농장","https://t1.daumcdn.net/finance/chart/kr/stock/d/E4012001.png?timestamp="+date_re,
			"sirip.kr",arrow+" "+KOSDAQ_current+" | "+var_percent+"%\n===============================\n"+KOSDAQ_log,"KOSDAQ",996,519)

	}

}

function stock_search_general_return(name){ //주식 이름 찾고 띄워주는 것 까지
	var URL = stock_search(name)

	var data = stock_general_parse(URL)

	var str = data[0] +"\n"+data[1]+"원 ("+data[2]+", "+data[3]+")"

	return str
}

function stock_search(name){ // 주식 이름 찾기
	return org.jsoup.Jsoup.connect("https://kr.investing.com/search/?q="+encodeURI(name)).get().select("a.js-inner-all-results-quote-item").attr("href")
}

function stock_general_parse(URL){ // 주식 파싱 일반화 (2020_05_12)

	var temp = org.jsoup.Jsoup.connect("https://kr.investing.com/"+URL).get()

	var name = temp.select(".float_lang_base_1").get(0).ownText()

	var value = temp.select(".arial_26").get(0).ownText() // 현재 주가
	var UD = temp.select(".arial_20").get(0).ownText() // 등락
	var UDP = temp.select(".arial_20").get(1).ownText() // 등락 퍼센트

	var str = [];

	str[0] = name
	str[1] = value
	str[2] = UD
	str[3] = UDP

	return str
}

function stock_general_parse_return(URL){ // 주식 파싱 일반화 및 reply까지 (2020_05_12)

	var data = stock_general_parse(URL)

	var str = data[0] +"\n"+data[1]+"원 ("+data[2]+", "+data[3]+")"

	return str
}



//=====================================================================================================================================
//=====================================================================================================================================
//=====================================================================================================================================

function sugang() {

	var str = ""

	var apikey = "201808506NVF93269"
	//var apikey2 = "201902537LTU88652" // 1학년 api key

	var apikey2 = "201808504QPI68682" // 대학원생 api key
	var year = "2019"
	var term = "A20" // A10, A20
	var page = "http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A20&deptDiv=23100&dept=A200110111&subDept=A200160116" //전전컴
	var parse = org.jsoup.Jsoup.connect(page).maxBodySize(0).get()
	var num = parse.select("subject_nm").toArray().length

	//D.create("parsing_UOS_DB",{DB_num:"1",year:"1",term:"1",subject_div:"1",subject_div2:"1",class_div:"1",subject_no:"1",subject_nm:"1",sub_dept:"1",day_night_nm:"1",shyr:"1",credit:"1",class_nm:"1",prof_nm:"1",class_type:"1",tlsn_limit_count:"1",tlsn_count:"1",etc_permit_yn:"1",sec_permit_yn:"1"})

	//D.delete(string table, string whereClause, string[] whereArgs)
	//D.delete("parsing_UOS_DB","year=? and term=?",[year,term])

	var class_div = [] // 분반
	var subject_nm = [] // 과목명
	var prof_nm = []
	var tlsn_limit_count = [] // 수강정원
	var tlsn_count = [] // 수강인원

	var class_div_temp = parse.select("class_div").toArray()
	var subject_nm_temp = parse.select("subject_nm").toArray()
	var prof_nm_temp = parse.select("prof_nm").toArray()
	var tlsn_limit_count_temp = parse.select("tlsn_limit_count").toArray()
	var tlsn_count_temp = parse.select("tlsn_count").toArray()

	for (var i = 0; i < num; i++) {
		class_div[i] = class_div_temp[i].text()
		subject_nm[i] = subject_nm_temp[i].text()
		prof_nm[i] = prof_nm_temp[i].text()
		tlsn_limit_count[i] = tlsn_limit_count_temp[i].text()
		tlsn_count[i] = tlsn_count_temp[i].text()

		if( Number(tlsn_limit_count[i]) > Number(tlsn_count[i]) )  {
			for(var k=1 ; k<getNum("Num_A20"); k++){
				if ( subject_nm[i] == getDB("Sub_A20_"+k) && prof_nm[i] == getDB("Prof_A20_"+k) ) {
					str += ""+getDB("Sub_A20_"+k)+"("+getDB("Prof_A20_"+k)+"교수님) 자리 있음!\n"
				}
			}

		}
	}// for문 끝 (주의)

	//==============================================================================================
	/*
	var page2 = "http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A10&deptDiv=21300&dept=A201120212&subDept=A201160216" //교양
	var parse2 = org.jsoup.Jsoup.connect(page2).maxBodySize(0).get()
	var num2 = parse2.select("subject_nm").toArray().length

	var class_div = [] // 분반
	var subject_nm = [] // 과목명
	var prof_nm = []
	var tlsn_limit_count = [] // 수강정원
	var tlsn_count = [] // 수강인원

	var class_div_temp = parse2.select("class_div").toArray()
	var subject_nm_temp = parse2.select("subject_nm").toArray()
	var prof_nm_temp = parse2.select("prof_nm").toArray()
	var tlsn_limit_count_temp = parse2.select("tlsn_limit_count").toArray()
	var tlsn_count_temp = parse2.select("tlsn_count").toArray()
	*/

	/*
	for (var i = 0; i < num2; i++) {
		class_div[i] = class_div_temp[i].text()
		subject_nm[i] = subject_nm_temp[i].text()
		prof_nm[i] = prof_nm_temp[i].text()
		tlsn_limit_count[i] = tlsn_limit_count_temp[i].text()
		tlsn_count[i] = tlsn_count_temp[i].text()

		if(tlsn_limit_count[i]>tlsn_count[i]) {
			if (subject_nm[i] == "화폐금융론" && prof_nm[i] == "장병화") {
				str += "화폐금융론(장병화교수님) 자리 있음!\n"
			}
			if (subject_nm[i] == "경제사" && prof_nm[i] == "송헌재") {
				str += "경제사(송헌재교수님) 자리 있음!\n"
			}
			if (subject_nm[i] == "산업조직론" && prof_nm[i] == "정인호") {
				str += "산업조직론(정인호교수님) 자리 있음!\n"
			}
			if (subject_nm[i] == "교육철학및교육사" && prof_nm[i] == "곽태진") {
				str += "교육철학및교육사(곽태진교수님) 자리 있음!\n"
			}
			if (subject_nm[i] == "경제수학" && prof_nm[i] == "신성휘") {
				str += subject_nm[i]+"("+prof_nm[i]+"교수님) 자리 있음!\n"
			}
			if (subject_nm[i] == "경제학원론II(거시)" && prof_nm[i] == "곽태운") {
				str += subject_nm[i]+"("+prof_nm[i]+"교수님) 자리 있음!\n"
			}
			if (subject_nm[i] == "관리경제학" && prof_nm[i] == "신준호") {
				str += subject_nm[i]+"("+prof_nm[i]+"교수님) 자리 있음!\n"
			}
		}
	}// for문 끝 (주의)
	*/
	//==============================================================================================

	setDB("sugang_333",getDB("sugang_222"))
	setDB("sugang_222",getDB("sugang_111"))
	setDB("sugang_111",str)
	if(str!="" && getDB("sugang_333")!=getDB("sugang_111")){
		//Api.replyRoom("공지확인방2",str+make_time())
		Api.replyRoom("봇장난",str+make_time())
		Api.replyRoom("시갤톡방",str+make_time())
		Api.replyRoom("공지확인방3",str+make_time())
	}
}

function sugang_list(){
	var num = getNum("Num_A20")
	var str = ""
	for(var i=1; i<num; i++){
		str += getDB("Sub_A20_"+i) +" : "+getDB("Prof_A20_"+i)+"교수님\n"
	}
	return str;
	//냠콘마이돌
}

function sugang2(action) { //테스트용 함수

	var str = ""

	var apikey = "201808506NVF93269"
	//var apikey2 = "201902537LTU88652" // 1학년 api key

	var apikey2 = "201808504QPI68682" // 대학원생 api key
	var year = "2019"
	var term = "A20" // A10, A20
	var page = "http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey=201808506NVF93269&year=2019&term=A20&deptDiv=23100&dept=A200110111&subDept=A200160116" //전전컴
	var parse = org.jsoup.Jsoup.connect(page).maxBodySize(0).get()
	var num = parse.select("subject_nm").toArray().length

	//D.create("parsing_UOS_DB",{DB_num:"1",year:"1",term:"1",subject_div:"1",subject_div2:"1",class_div:"1",subject_no:"1",subject_nm:"1",sub_dept:"1",day_night_nm:"1",shyr:"1",credit:"1",class_nm:"1",prof_nm:"1",class_type:"1",tlsn_limit_count:"1",tlsn_count:"1",etc_permit_yn:"1",sec_permit_yn:"1"})

	//D.delete(string table, string whereClause, string[] whereArgs)
	//D.delete("parsing_UOS_DB","year=? and term=?",[year,term])

	var class_div = [] // 분반
	var subject_nm = [] // 과목명
	var prof_nm = []
	var tlsn_limit_count = [] // 수강정원
	var tlsn_count = [] // 수강인원

	var class_div_temp = parse.select("class_div").toArray()
	var subject_nm_temp = parse.select("subject_nm").toArray()
	var prof_nm_temp = parse.select("prof_nm").toArray()
	var tlsn_limit_count_temp = parse.select("tlsn_limit_count").toArray()
	var tlsn_count_temp = parse.select("tlsn_count").toArray()

	for (var i = 0; i < num; i++) {
		class_div[i] = class_div_temp[i].text()
		subject_nm[i] = subject_nm_temp[i].text()
		prof_nm[i] = prof_nm_temp[i].text()
		tlsn_limit_count[i] = tlsn_limit_count_temp[i].text()
		tlsn_count[i] = tlsn_count_temp[i].text()

		if (action == "list") {
			for (var k = 1; k < getNum("Num_A20"); k++) {
				if (subject_nm[i] == getDB("Sub_A20_" + k) && prof_nm[i] == getDB("Prof_A20_" + k)) {
					str += "" + getDB("Sub_A20_" + k) + "(" + getDB("Prof_A20_" + k) + "교수님) : " + tlsn_count[i] + "/" + tlsn_limit_count[i] + "\n"}
			}
		}
		else if (action == "all") {
			str += "" + subject_nm[i] + "(" + prof_nm[i] + "교수님) : " + tlsn_count[i] + "/" + tlsn_limit_count[i] + "\n"
		}

	}// for문 끝 (주의)

	return str;
}


//=====================================================================================================================================
//=====================================================================================================================================
//=====================================================================================================================================

function make_time(){
	//return time string  ->  HH-MM-SS
	var date = new Date();
	return (((H = date.getHours()) < 10) ? "0" + H : H) + ":" + (((M = date.getMinutes()) < 10) ? "0" + M : M) + ":" + (((S = date.getSeconds()) < 10) ? "0" + S : S);
}


function UOS_Time_DB_update(year_,term_,action){ // 시간표업데이트용 #action "I", "U"

	Api.replyRoom("봇장난","DB업데이트 시작")
	var apikey = "201808506NVF93269"
	//var apikey2 = "201902537LTU88652" // 1학년 api key
	var apikey2 = "201808504QPI68682" // 대학원생 api key
	var year = year_
	var term = term_ // A10, A20
	var page = "http://wise.uos.ac.kr/uosdoc/api.ApiUcrMjTimeInq.oapi?apiKey="+apikey+"&year="+year+"&term="+term+"&deptDiv=*&dept=*&subDept=*" //전공
	var page2 = "http://wise.uos.ac.kr/uosdoc/api.ApiUcrCultTimeInq.oapi?apiKey="+apikey2+"&year="+year+"&term="+term+"&subjectDiv=*" //교양
	var parse = org.jsoup.Jsoup.connect(page).maxBodySize(0).get()
	var num = parse.select("subject_nm").toArray().length

	//D.create("parsing_UOS_DB",{DB_num:"1",year:"1",term:"1",subject_div:"1",subject_div2:"1",class_div:"1",subject_no:"1",subject_nm:"1",sub_dept:"1",day_night_nm:"1",shyr:"1",credit:"1",class_nm:"1",prof_nm:"1",class_type:"1",tlsn_limit_count:"1",tlsn_count:"1",etc_permit_yn:"1",sec_permit_yn:"1"})

	//D.delete(string table, string whereClause, string[] whereArgs)
	//D.delete("parsing_UOS_DB","year=? and term=?",[year,term])

	var subject_div = []
	var subject_div2 = []
	var subject_no = [] // 과목번호
	var class_div = [] // 분반
	var subject_nm = [] // 과목명
	var sub_dept = [] // 학부
	var day_night_nm = [] // 주간 야간
	var shyr = [] // 학년 (0이면 대학원)
	var credit = [] // 학점
	var class_nm = [] // 시간 및 강의실
	var prof_nm = []
	var class_type = [] // 외국어강의
	var tlsn_limit_count = [] // 수강정원
	var tlsn_count = [] // 수강인원
	var etc_permit_yn = [] // 타과 허용
	var sec_permit_yn = [] // 복수전공

	var subject_div_temp = parse.select("subject_div").toArray()
	var subject_div2_temp = parse.select("subject_div2").toArray()
	var subject_no_temp = parse.select("subject_no").toArray()
	var class_div_temp = parse.select("class_div").toArray()
	var subject_nm_temp = parse.select("subject_nm").toArray()
	var sub_dept_temp = parse.select("sub_dept").toArray()
	var day_night_nm_temp = parse.select("day_night_nm").toArray()
	var shyr_temp = parse.select("shyr").toArray()
	var credit_temp = parse.select("credit").toArray()
	var class_nm_temp = parse.select("class_nm").toArray()
	var prof_nm_temp = parse.select("prof_nm").toArray()
	var class_type_temp = parse.select("class_type").toArray()
	var tlsn_limit_count_temp = parse.select("tlsn_limit_count").toArray()
	var tlsn_count_temp = parse.select("tlsn_count").toArray()
	var etc_permit_yn_temp = parse.select("etc_permit_yn").toArray()
	var sec_permit_yn_temp = parse.select("sec_permit_yn").toArray()

	var DB_num = []

	for(var i=0 ; i<num ; i++){
		subject_div[i] = subject_div_temp[i].text()
		subject_div2[i] = subject_div2_temp[i].text()
		class_div[i] = class_div_temp[i].text()
		subject_no[i] = subject_no_temp[i].text()
		subject_nm[i] =  subject_nm_temp[i].text()
		sub_dept[i] = sub_dept_temp[i].text()
		day_night_nm[i] = day_night_nm_temp[i].text()
		shyr[i] = shyr_temp[i].text()
		credit[i] = credit_temp[i].text()
		class_nm[i] = class_nm_temp[i].text()
		prof_nm[i] = prof_nm_temp[i].text()
		class_type[i] = class_type_temp[i].text()
		tlsn_limit_count[i] = tlsn_limit_count_temp[i].text()
		tlsn_count[i] = tlsn_count_temp[i].text()
		etc_permit_yn[i] = etc_permit_yn_temp[i].text()
		sec_permit_yn[i] = sec_permit_yn_temp[i].text()

		DB_num[i] = year + "_" + term + "_" + subject_no[i] + "_" + class_div[i]

		//D.insert(string table, object values)
		if(action == "I"){
			D.insert("parsing_UOS_DB",{
				DB_num:DB_num[i],
				year:year,
				term:term,
				subject_div:subject_div[i],
				subject_div2:subject_div2[i],
				class_div:class_div[i],
				subject_no:subject_no[i],
				subject_nm:subject_nm[i],
				sub_dept:sub_dept[i],
				day_night_nm:day_night_nm[i],
				shyr:shyr[i],
				credit:credit[i],
				class_nm:class_nm[i],
				prof_nm:prof_nm[i],
				class_type:class_type[i],
				tlsn_limit_count:tlsn_limit_count[i],
				tlsn_count:tlsn_count[i],
				etc_permit_yn:etc_permit_yn[i],
				sec_permit_yn:sec_permit_yn[i]
			})
		}
		else if(action == "U"){
			D.update("parsing_UOS_DB", {
				//DB_num:DB_num[i],
				year:year,
				term:term,
				subject_div:subject_div[i],
				subject_div2:subject_div2[i],
				class_div:class_div[i],
				subject_no:subject_no[i],
				subject_nm:subject_nm[i],
				sub_dept:sub_dept[i],
				day_night_nm:day_night_nm[i],
				shyr:shyr[i],
				credit:credit[i],
				class_nm:class_nm[i],
				prof_nm:prof_nm[i],
				class_type:class_type[i],
				tlsn_limit_count:tlsn_limit_count[i],
				tlsn_count:tlsn_count[i],
				etc_permit_yn:etc_permit_yn[i],
				sec_permit_yn:sec_permit_yn[i]
			}, "DB_num=?", DB_num[i])
		}
	}

	var parse = org.jsoup.Jsoup.connect(page2).maxBodySize(0).get()
	var num = parse.select("subject_nm").toArray().length

	var subject_div = []
	var subject_div2 = []
	var subject_no = [] // 과목번호
	var class_div = [] // 분반
	var subject_nm = [] // 과목명
	var sub_dept = [] // 학부
	var day_night_nm = [] // 주간 야간
	var shyr = [] // 학년 (0이면 대학원)
	var credit = [] // 학점
	var class_nm = [] // 시간 및 강의실
	var prof_nm = []
	var class_type = [] // 외국어강의
	var tlsn_limit_count = [] // 수강정원
	var tlsn_count = [] // 수강인원
	var etc_permit_yn = [] // 타과 허용
	var sec_permit_yn = [] // 복수전공

	var subject_div_temp = parse.select("subject_div").toArray()
	var subject_div2_temp = parse.select("subject_div2").toArray()
	var subject_no_temp = parse.select("subject_no").toArray()
	var class_div_temp = parse.select("class_div").toArray()
	var subject_nm_temp = parse.select("subject_nm").toArray()
	var sub_dept_temp = parse.select("sub_dept").toArray()
	var day_night_nm_temp = parse.select("day_night_nm").toArray()
	var shyr_temp = parse.select("shyr").toArray()
	var credit_temp = parse.select("credit").toArray()
	var class_nm_temp = parse.select("class_nm").toArray()
	var prof_nm_temp = parse.select("prof_nm").toArray()
	var class_type_temp = parse.select("class_type").toArray()
	var tlsn_limit_count_temp = parse.select("tlsn_limit_count").toArray()
	var tlsn_count_temp = parse.select("tlsn_count").toArray()
	var etc_permit_yn_temp = parse.select("etc_permit_yn").toArray()
	var sec_permit_yn_temp = parse.select("sec_permit_yn").toArray()

	var DB_num = []

	for(var i=0 ; i<num ; i++){
		subject_div[i] = subject_div_temp[i].text()
		subject_div2[i] = subject_div2_temp[i].text()
		class_div[i] = class_div_temp[i].text()
		subject_no[i] = subject_no_temp[i].text()
		subject_nm[i] =  subject_nm_temp[i].text()
		sub_dept[i] = sub_dept_temp[i].text()
		day_night_nm[i] = day_night_nm_temp[i].text()
		shyr[i] = shyr_temp[i].text()
		credit[i] = credit_temp[i].text()
		class_nm[i] = class_nm_temp[i].text()
		prof_nm[i] = prof_nm_temp[i].text()
		class_type[i] = class_type_temp[i].text()
		tlsn_limit_count[i] = tlsn_limit_count_temp[i].text()
		tlsn_count[i] = tlsn_count_temp[i].text()
		etc_permit_yn[i] = etc_permit_yn_temp[i].text()
		sec_permit_yn[i] = sec_permit_yn_temp[i].text()




		DB_num[i] = year + "_" + term + "_" + subject_no[i] + "_" + class_div[i]

		//D.insert(string table, object values)
		if(action == "I"){
			D.insert("parsing_UOS_DB",{
				DB_num:DB_num[i],
				year:year,
				term:term,
				subject_div:subject_div[i],
				subject_div2:subject_div2[i],
				class_div:class_div[i],
				subject_no:subject_no[i],
				subject_nm:subject_nm[i],
				sub_dept:sub_dept[i],
				day_night_nm:day_night_nm[i],
				shyr:shyr[i],
				credit:credit[i],
				class_nm:class_nm[i],
				prof_nm:prof_nm[i],
				class_type:class_type[i],
				tlsn_limit_count:tlsn_limit_count[i],
				tlsn_count:tlsn_count[i],
				etc_permit_yn:etc_permit_yn[i],
				sec_permit_yn:sec_permit_yn[i]
			})
		}
		else if(action == "U"){
			D.update("parsing_UOS_DB", {
				//DB_num:DB_num[i],
				year:year,
				term:term,
				subject_div:subject_div[i],
				subject_div2:subject_div2[i],
				class_div:class_div[i],
				subject_no:subject_no[i],
				subject_nm:subject_nm[i],
				sub_dept:sub_dept[i],
				day_night_nm:day_night_nm[i],
				shyr:shyr[i],
				credit:credit[i],
				class_nm:class_nm[i],
				prof_nm:prof_nm[i],
				class_type:class_type[i],
				tlsn_limit_count:tlsn_limit_count[i],
				tlsn_count:tlsn_count[i],
				etc_permit_yn:etc_permit_yn[i],
				sec_permit_yn:sec_permit_yn[i]
			}, "DB_num=?", DB_num[i])
		}
	}
	Api.replyRoom("봇장난","DB업데이트 종료")

}

//=====================================================================================================================================
//=====================================================================================================================================
//=====================================================================================================================================

function UOS_Time_DB_search(key,year_,term_){
	var str = "%"+key.split("").join("%")+"%"
	var res = ""
	var mc = ""

	var i=0
	var j=0
	var temp = 0


	var DB_num = [] //0
	var	year = []
	var	subject_div = []
	var	subject_div2 = []
	var	class_div = []
	var	subject_no =[]
	var	subject_nm = []
	var	sub_dept = []
	var day_night_nm = []
	var	shyr = []
	var	class_nm = []
	var	prof_nm = []
	var	class_type = []
	var	tlsn_limit_count = []
	var	tlsn_count = []
	var	etc_permit_yn = []
	var	sec_permit_yn = [] // 16

	if(term_==""){
		mc=D.rawQuery("select * from parsing_UOS_DB where subject_nm like '"+str+"' and year = '"+year_+"'",null) // 교과목명에서 검색
		while(mc.moveToNext()){
			for(var i=0;i<16;i++){
				res+=mc.getString(i)+"||"
			}
			res+=mc.getString(16)+"\n"
		}
		mc.close()
	}
	else{
		mc=D.rawQuery("select * from parsing_UOS_DB where subject_nm like '"+str+"' and year = '"+year_+"' and term = '"+term_+"'",null) // 교과목명에서 검색
		while(mc.moveToNext()){
			for(var i=0;i<16;i++){
				res+=mc.getString(i)+"||"
			}
			res+=mc.getString(16)+"\n"
		}
		mc.close()
	}


	if(term_=="") {
		mc=D.rawQuery("select * from parsing_UOS_DB where prof_nm like '"+str+"' and year = '"+year_+"'",null) // 담당교수명에서 검색
		while(mc.moveToNext()){
			for(var i=0;i<16;i++){
				res+=mc.getString(i)+"||"
			}
			res+=mc.getString(16)+"\n"
		}
		mc.close()
	}
	else{
		mc=D.rawQuery("select * from parsing_UOS_DB where prof_nm like '"+str+"' and year = '"+year_+"' and term = '"+term_+"'",null) // 담당교수명에서 검색
		while(mc.moveToNext()){
			for(var i=0;i<16;i++){
				res+=mc.getString(i)+"||"
			}
			res+=mc.getString(16)+"\n"
		}
		mc.close()
	}


	if(term_=="") {
		mc=D.rawQuery("select * from parsing_UOS_DB where sub_dept like '"+str+"' and year = '"+year_+"'",null) // 학과명에서 검색
		while(mc.moveToNext()){
			for(var i=0;i<16;i++){
				res+=mc.getString(i)+"||"
			}
			res+=mc.getString(16)+"\n"
		}
		mc.close()
	}
	else{
		mc=D.rawQuery("select * from parsing_UOS_DB where sub_dept like '"+str+"' and year = '"+year_+"' and term = '"+term_+"'",null) // 학과명에서 검색
		while(mc.moveToNext()){
			for(var i=0;i<16;i++){
				res+=mc.getString(i)+"||"
			}
			res+=mc.getString(16)+"\n"
		}
		mc.close()
	}


	return res
}

//=====================================================================================================================================
//=====================================================================================================================================
//=====================================================================================================================================




//=====================================================================================================================================
//====================================================    파싱     ====================================================================
//=====================================================================================================================================




function range () { //start , stop , step
	args = arguments;
	var length = args.length;
	var start = 0;
	var end = 0;
	var step = 1;
	var a = [];
	if (length == 1) {
		end = args[0];
		if (end < 0) {
			step = -1;
		}
	}
	if (length == 2) {
		start = args[0], end = args[1];
		if (start > end) {
			step = -1;
		}
	}
	if (length == 3) {
		start = args[0], end = args[1], step = args[2];
	}
	if ((end - start) * step > 0) {
		if (start <= end) {
			for (var i = start; i < end; i += step) {
				a.push(i);
			}
		} else {
			for (var i = start; i > end; i += step) {
				a.push(i);
			}
		}
	}
	return a;
}

function fileSize(file){
	if(file.isFile()) length = file.length();
	else{
		var files=file.listFiles();
		var length=0;
		for(var i=0; i<files.length;i++){
			length += fileSize(files[i]);
		}}
	return length;
}

function addByte(length){
	if(length<1000){return length+"byte"}
	if(length>=1000&&length<1000000){return (length/1000).toFixed(1) +"kb"}
	if(length>=1000000){return (length/1000000).toFixed(1) + "mb"}
}
/*
function filesort(list) {
var filelist = list;
var folders = [];
var files = [];
for(var i=0; i<filelist.length; i++){
if(filelist[i].isFile()){ //if file
	files.push(filelist[i]);
}
else { //if folder
	folders.push(filelist[i]);
}
}
folders.sort();
files.sort();
folders.concat(files);
return folders;
}
*/



function showlist(path){
	var AA=new java.io.File(path).listFiles();
	//AA = filesort(AA);
	var BB=""
	for(var i=0; i<AA.length; i++){
		var a = new java.io.File(path+"/"+AA[i].getName())
		BB += AA[i].getName() +" "+ addByte(fileSize(a))+ "\n";
	}
	return BB;
}


//=====================================================================================================================================
//====================================================    DB     ====================================================================
//=====================================================================================================================================

function setDB(key,value){
	if(D.selectForArray("mTable", null, "k like ?", key).length == 0){ // 해당하는 key에 value가 없는 경우
		D.insert("mTable",{k:key, v:value})
	}
	else{ // 해당하는 key에 value가 있는 경우
		D.update("mTable", {v:value}, "k=?", [key])
	}
}

function getDB(key){
	var arr = D.selectForArray("mTable", null, "k=?", [key]);
	if (arr.length > 0) {
		return arr[0][1];
	} else {
		return undefined;
	}
}

function getNum(key) {
	var value = getDB(key);
	return isNaN(value) ? 0 : Number(getDB(key));
}

//================================================================================================

function setEDB(번호0,단어0,뜻0,예문0,예문뜻0){
	if(D.selectForArray("English", null, "번호 = ?", 번호0).length == 0){ // 해당하는 key에 value가 없는 경우
		D.insert("English",{번호:번호0, 단어:단어0, 뜻:뜻0, 예문:예문0, 예문뜻:예문뜻0})
	}
	else{ // 해당하는 key에 value가 있는 경우
		D.update("English", {단어:단어0, 뜻:뜻0, 예문:예문0, 예문뜻:예문뜻0}, "번호=?", [번호0])
	}
}

function getEDB(번호0){
	var arr = D.selectForArray("English", null, "번호 = ?", [번호0]);
	if (arr.length > 0) {
		return arr[0];
	} else {
		return undefined;
	}
}

function updateEDB() {
	Api.replyRoom("봇장난","영어단어DB 업데이트 시작");
	timer.start()

	var DB_English = readFile("EnglishDB").split("\n\n")
	var Num = DB_English.length
	setDB("EnglishNumber",Num)

	for(var i=0 ; i < Num ; i++){
		var number = DB_English[i].split("\n")[0].split("    ")[0]
		var word = DB_English[i].split("\n")[0].split("    ")[1].replace("-n","\n")
		var mean = DB_English[i].split("\n")[0].split("    ")[2]
		var ex = DB_English[i].split("\n")[1]
		var exmean = DB_English[i].split("\n")[2]
		setEDB(number,word,mean,ex,exmean)
	}
	Api.replyRoom("봇장난","영어단어DB 업데이트 완료");
	msg = "경과시간: " + java.lang.String.format("%.2f",timer.end()/1000) + "초";
	Api.replyRoom("봇장난",msg);
}

function updateProfile(name){
	var Num = D.selectForArray("profile_"+name,"번호").length
	if(Num==getDB("EnglishNumber")){
		return 0
	}
	else{
		var start = Num
		for(var i=start ; i < getDB("EnglishNumber") ; i++){
			D.insert("profile_"+name,{번호:i+1,숙련도:2,횟수:0})
		}
	}
}

//----------------------


function setZDB(key,value){
	var mcursor=null;
	try{
		mcursor = myDB.rawQuery("select * from ZYHR where k='"+key.qtmark()+"';",null);
	}catch(e){
		Log.e("setDB error\n"+e+"\n"+e.stack);
		myDB.execSQL("create table ZYHR (k text PRIMARY KEY, v text);");
	}
	if(!mcursor || mcursor.getCount()==0){
		myDB.execSQL("insert into ZYHR (k, v) values('"+key.qtmark()+"', '"+new String(value).qtmark()+"');");
	}else{
		myDB.execSQL("update ZYHR set v = '"+new String(value).qtmark()+"' where k='"+key.qtmark()+"';");
	}
	if(mcursor) mcursor.close();
	return value;
}

function getZDB(key){
	var mcursor;
	try{
		mcursor = myDB.rawQuery("select * from ZYHR where k='"+key.qtmark()+"';",null);
	}catch(e){
		Log.e("getDB error\n"+e+"\n"+e.stack);
		return null;
	}
	if(mcursor.moveToNext()){
		var res=mcursor.getString(1);
		mcursor.close();
		return String(res);
	}else{
		mcursor.close();
		return undefined;
	}
}

function getZNum(key) {
	var value = getZDB(key);
	return isNaN(value) ? 0 : Number(getZDB(key));
}

//=============================================================================================


function setUOSDB(key,value){
	var mcursor=null;
	try{
		mcursor = myDB.rawQuery("select * from UOSDB where k='"+key.qtmark()+"';",null);
	}catch(e){
		Log.e("setDB error\n"+e+"\n"+e.stack);
		myDB.execSQL("create table UOSDB (k text PRIMARY KEY, v text);");
	}
	if(!mcursor || mcursor.getCount()==0){
		myDB.execSQL("insert into UOSDB (k, v) values('"+key.qtmark()+"', '"+new String(value).qtmark()+"');");
	}else{
		myDB.execSQL("update UOSDB set v = '"+new String(value).qtmark()+"' where k='"+key.qtmark()+"';");
	}
	if(mcursor) mcursor.close();
	return value;
}

function getUOSDB(key){
	var mcursor;
	try{
		mcursor = myDB.rawQuery("select * from UOSDB where k='"+key.qtmark()+"';",null);
	}catch(e){
		Log.e("getDB error\n"+e+"\n"+e.stack);
		return null;
	}
	if(mcursor.moveToNext()){
		var res=mcursor.getString(1);
		mcursor.close();
		return String(res);
	}else{
		mcursor.close();
		return undefined;
	}
}

function getUOSNum(key) {
	var value = getZDB(key);
	return isNaN(value) ? 0 : Number(getZDB(key));
}


function strcmp(a, b)
{
	return (a<b?-1:(a>b?1:0));
}

function updateDB() {
	Api.replyRoom("봇장난","DB 업데이트 시작");
	timer.start()
	//var checksum=Utils.getWebText('https://github.com/Schwalbe262/uosgall_bot/commits/master').split('repository-content')[1].split('commit/')[1].split('"')[0];
	var checksum=Utils.getWebText('https://github.com/Schwalbe262/uosgall_bot').split('repository-content')[1].split('commit/')[1].split('"')[0];
	var conn = new java.net.URL("https://raw.githubusercontent.com/Schwalbe262/uosgall_bot/"+checksum+"/ECEDB").openConnection();
	conn.setRequestProperty("Content-Type", "text/xml;charset=utf-8");
	var is=conn.getInputStream();
	var br=new java.io.BufferedReader(new java.io.InputStreamReader(is));
	//var scan = new java.util.Scanner(is);
	var str = ''
	var tmp=null;
	while (((tmp = br.readLine()) != null)) {
		str += tmp+"\n";
	}
	br.close();
	saveFile("ECEDB.txt", str);
	Api.replyRoom("봇장난","DB 업데이트 완료");
	msg = "경과시간: " + java.lang.String.format("%.2f",timer.end()/1000) + "초";
	Api.replyRoom("봇장난",msg);

	var DB_ECE = readFile("ECEDB.txt")
	var Num = textCount(DB_ECE,"\n")
	while(DB_ECE.indexOf("\n")>0){
		DB_ECE = DB_ECE.replace("\n", "\t\t");
	}
	var arrDate = DB_ECE.split("\t\t")

	for(var i=0 ; i < Num ; i++){
		setUOSDB("교과목명_"+i,arrDate[3*i])
		setUOSDB("담당교수_"+i,arrDate[3*i+1])
		setUOSDB("강의시간및강의실_"+i,arrDate[3*i+2])
		setUOSDB("ECE_count"+i,i)
		setUOSDB("교과목명_"+i+"_main",getUOSDB("교과목명_"+i).split(", ")[0])
	}
}




// ================================================== 시간표 DB 신형 ===========================================================


function updateUOSDB(year,sem) {
	// >D.create("UOSTime",{DB_번호:"0", DB_년도:"0", DB_학기:"0",DB_학부:"0", DB_교과구분:"0", DB_세부영역:"0", DB_교과번호:"0", DB_분반:"0", DB_교과목명:"0", DB_학년:"0", DB_학점:"0", DB_담당교수:"0", DB_주야:"0", DB_강의유형:"0", DB_강의시간및강의실:"0"})//DB_년도, DB_학기,DB_학부, DB_교과구분, DB_교과번호, DB_분반, DB_교과목명, DB_학년, DB_학점, DB_담당교수, DB_주야, DB_강의유형, DB_강의시간및강의실
	Api.replyRoom("봇장난","DB 업데이트 시작");
	timer.start()
	var DB_str = readFile("UOStimeDB")
	DB_str = DB_str.replace(/III/,"3")
	DB_str = DB_str.replace(/II/,"2")
	DB_str = DB_str.replace(/I/,"1")
	DB_str = DB_str.replace(/Ⅱ/,"2")
	DB_str = DB_str.replace(/Ⅲ/,"3")
	DB_str = DB_str.replace(/Ⅳ/,"4")
	var Num_DB = textCount(DB_str,"\n")

	var DB_번호 = ""
	var DB_년도 = ""
	var DB_학기 = ""
	var DB_학부 = ""
	var DB_교과구분 = ""
	var DB_세부영역 = ""
	var DB_교과번호 = ""
	var DB_분반 = ""
	var DB_교과목명 = ""
	var DB_학년 = ""
	var DB_학점 = ""
	var DB_담당교수 = ""
	var DB_주야 = ""
	var DB_강의유형 = ""
	var DB_강의시간및강의실 = ""

	var DB_str_split = ""

	D.delete("UOSTime")
	for(var i=0 ; i < Num_DB ; i++){

		DB_str_split = DB_str.split("\n")[i]

		DB_학부 = DB_str_split.split("\t")[3]
		DB_교과구분 = DB_str_split.split("\t")[4]
		DB_세부영역 = DB_str_split.split("\t")[5]
		DB_교과번호 = DB_str_split.split("\t")[6]
		DB_분반 = DB_str_split.split("\t")[7]
		DB_교과목명 = DB_str_split.split("\t")[8]
		DB_학년 = DB_str_split.split("\t")[9]
		DB_학점 = DB_str_split.split("\t")[10]
		DB_담당교수 = DB_str_split.split("\t")[11]
		DB_주야 = DB_str_split.split("\t")[12]
		DB_강의유형 = DB_str_split.split("\t")[13]
		DB_번호 = DB_str_split.split("\t")[0]
		DB_년도 = DB_str_split.split("\t")[1]
		DB_학기 = DB_str_split.split("\t")[2]
		DB_강의시간및강의실 = DB_str_split.split("\t")[14]
		D.insert("UOStime", {DB_번호:DB_번호, DB_년도:DB_년도, DB_학기:DB_학기,DB_학부:DB_학부, DB_교과구분:DB_교과구분, DB_세부영역:DB_세부영역, DB_교과번호:DB_교과번호, DB_분반:DB_분반, DB_교과목명:DB_교과목명, DB_학년:DB_학년, DB_학점:DB_학점, DB_담당교수:DB_담당교수, DB_주야:DB_주야, DB_강의유형:DB_강의유형, DB_강의시간및강의실:DB_강의시간및강의실})
	}
	Api.replyRoom("봇장난","DB 업데이트 완료");
	msg = "경과시간: " + java.lang.String.format("%.2f",timer.end()/1000) + "초";
	Api.replyRoom("봇장난",msg);
}

//밑에 DB 개량후 폐기
function searchDB(key,year){
	var str = "%"+key.split("").join("%")+"%"
	var res = ""
	var mc = ""

	var i=0
	var j=0
	var temp = 0

	var DB_번호 = [] //0
	var DB_년도 = [] //1
	var DB_학기 = [] //2
	var DB_학부 = [] //3
	var DB_교과구분 = [] //4
	var DB_세부영역 = [] //5
	var DB_교과번호 = [] //6
	var DB_분반 = [] //7
	var DB_교과목명 = [] //8
	var DB_학년 = [] //9
	var DB_학점 = [] //10
	var DB_담당교수 = [] //11
	var DB_주야 = [] //12
	var DB_강의유형 = [] //13
	var DB_강의시간및강의실 = [] //14

	mc=D.rawQuery("select * from UOStime where DB_교과목명 like '"+str+"' and DB_년도 = '"+year+"'",null) // 교과목명에서 검색
	while(mc.moveToNext()){
		for(var i=0;i<14;i++){
			res+=mc.getString(i)+"||"
		}
		res+=mc.getString(14)+"\n"
	}
	mc.close()

	mc=D.rawQuery("select * from UOStime where DB_담당교수 like '"+str+"' and DB_년도 = '"+year+"'",null) // 담당교수명에서 검색
	while(mc.moveToNext()){
		for(var i=0;i<14;i++){
			res+=mc.getString(i)+"||"
		}
		res+=mc.getString(14)+"\n"
	}
	mc.close()

	return res
}



// =========================================== chat DB =========================================================================

function setChatDB(sender,room){ // 매 대화마다 ChatDB 갱신 (추후 주기적으로 한번에 유DB 접근하게 개선 요함)
	//D.creat("chatTable", {sender : sender, room : room, hourChat : 0, dayChat : 0, Chat : 0}) // 첫 테이블 생성코드

	if( D.selectForArray("chatTable",null,"sender like ? and room like ?",[sender,room]) == "" ){ // 대화가 처음 일어난 경우
		D.insert("chatTable", {sender : sender, room : room, hourChat : 1, dayChat : 1, Chat : 1})
	}
	else{
		var hourChat_temp = Number( D.selectForArray("chatTable","hourChat","sender like ? and room like ?",[sender,room]) )
		var dayChat_temp = Number( D.selectForArray("chatTable","dayChat","sender like ? and room like ?",[sender,room]) )
		var Chat_temp = Number( D.selectForArray("chatTable","Chat","sender like ? and room like ?",[sender,room]) )
		D.update("chatTable", {hourChat : hourChat_temp+1, dayChat : dayChat_temp+1, Chat : Chat_temp+1}, "sender like ? and room like ?",[sender,room])
	}
}

function getChatDB(room){ // 해당 room chatDB 출력
	Api.replyRoom("봇장난",D.selectForString("chatTable",null,"room like ?",[room]))
}

function clearHourDB(){ // hourChat 초기화
	D.update("chatTable", {hourChat : 0}, null, null)
}

function clearDayDB(){ // dayChat 초기화
	D.update("chatTable", {dayChat : 0}, null, null)
}

function searchMaxDB(room,object){ //해당 room에서 해당하는 max log 검색
	var max = 0; // max 값
	var max_people = 0; // max를 가진 사람
	if(object == "whole"){ // 전체 채팅량 max 구하기
		max = Math.max.apply(null, D.selectForArray("chatTable","Chat","room like ?",[room]))
		max_people = D.selectForArray("chatTable","sender","room=?",[room],{orderBy:"Chat desc"})[0]
	}
	else if(object == "hour"){ // 1시간 채팅량 max 구하기
		max = Math.max.apply(null, D.selectForArray("chatTable","hourChat","room like ?",[room]))
		max_people = D.selectForArray("chatTable","sender","room=?",[room],{orderBy:"hourChat desc"})[0]
	}
	else if(object == "day"){ // 1일 채팅량 max 구하기
		max = Math.max.apply(null, D.selectForArray("chatTable","dayChat","room like ?",[room]))
		max_people = D.selectForArray("chatTable","sender","room=?",[room],{orderBy:"dayChat desc"})[0]
	}
	var str = max_people+"||"+max
	return str
}

function sumDB(room,object){
	var sum = 0
	if(object == "whole"){ // 전체 채팅량 구하기
		for(var i=0 ; i < D.selectForArray("chatTable","Chat","room like ?",[room]).length ; i++){
			sum += Number(D.selectForArray("chatTable","Chat","room like ?",[room])[i])
		}
	}
	else if(object == "hour"){ // 1시간 채팅량 구하기
		for(var i=0 ; i < D.selectForArray("chatTable","hourChat","room like ?",[room]).length ; i++){
			sum += Number(D.selectForArray("chatTable","hourChat","room like ?",[room])[i])
		}
	}
	else if(object == "day"){ // 1일 채팅량 구하기
		for(var i=0 ; i < D.selectForArray("chatTable","dayChat","room like ?",[room]).length ; i++){
			sum += Number(D.selectForArray("chatTable","dayChat","room like ?",[room])[i])
		}
	}
	return sum
}


// =========================================== chat DB =========================================================================




function searchStr(str,temp){ // str안에 temp의 모든 글자가 들어가는지 검색

	temp = temp.replace(/ /g,'')
	temp = temp.split("")
	temp.unshift("")
	temp.push("")
	temp=temp.join(".*")
	temp=new RegExp(temp)
	return temp.test(str)
}

function searchZYHRDB(Date){
	var res = ""
	var mc = ""

	var str = "%"+Date+"%"

	var i=0
	var num=0

	mc=myDB.rawQuery("select * from ZYHR where v like '"+str+"'",null)
	while(mc.moveToNext()){
		res+=mc.getString(0)+"||"+mc.getString(1).split("||")[1]+"\n"
	}
	mc.close()

	var max = res.split("\n").length
	while(i<max){
		num++
		i++
	}

	return i

}

//=====================================================================================================================================
//====================================================    DB끝     ====================================================================
//=====================================================================================================================================

getEcoLibSeat=function() {
	abc = org.jsoup.Jsoup.connect("http://wisem.uos.ac.kr/mobile/MA/xml_seat_status_list.php").data("lib_gb", "A").post().select("item").toArray();
	res = "";
	for (var i = 0; i < abc.length; i++) {
		res += abc[i].select("room_name").text().replace("(경) ", "") + " (" + abc[i].select("use_seat").text() + "/" + abc[i].select("total_seat").text() + ")\n";
	}
	res += "(점유좌석/총좌석)"
	return res;
}
getLawLibSeat=function() {
	abc = org.jsoup.Jsoup.connect("http://wisem.uos.ac.kr/mobile/MA/xml_seat_status_list.php").data("lib_gb", "L").post().select("item").toArray();
	res = "";
	for (var i = 0; i < abc.length; i++) {
		res += abc[i].select("room_name").text().replace("(법) ", "") + " (" + abc[i].select("use_seat").text() + "/" + abc[i].select("total_seat").text() + ")\n";
	}
	res += "(점유좌석/총좌석)"
	return res;
}








//==================================================================================================================================

function autostr(str_get){
	var data = [];
	str = "";
	data = str_get.split("\n");
	str += data[0] + data[1] + data[2] + data[3] + data[4] + "\n"
	var i=5;
	while(data[i]==undefined){
		str += data[i]
		i++
		str += data[i]
		i++
		str += data[i]
		i++
		str += data[i]
		str += "\n"
	}
	Api.replyRoom("봇장난",str)
}

//omok//
String.prototype.replaceAt=function(index, replacement) { return this.substr(0, index) + replacement+ this.substr(index + replacement.length); }
//check//
//상하좌우대각선 방향으로 총8번 검사.
var omokpan = "\
◎ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞ\n\
①┏┯┯┯┯┯┯┯┯┯┯┯┯┯┓\n\
②┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
③┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
④┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑤┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑥┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑦┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑧┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑨┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑩┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑪┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑫┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑬┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑭┠┼┼┼┼┼┼┼┼┼┼┼┼┼┨\n\
⑮┗┷┷┷┷┷┷┷┷┷┷┷┷┷┛\
"
function make2d_array(x,y)
{
	var init = 0
	var tt = new Array(y)
	for(var i = 0;i<y;i++){
		tt[i] = new Array(x)
		for(var j = 0;j<x;j++){
			tt[i][j] = init
		}
	}
	return tt
}

var stone = make2d_array(15,15)

function setStone(xpos,ypos,color){
//0:no stone 1:black 2:white
	xpos = xpos.charCodeAt(0)-65
	ypos -=1
	stone[ypos][xpos] = color
}

function putStone () {
	var pan = omokpan;
	for (var y = 0; y < 15; y++) {
		for (var x = 0; x < 15; x++) {
			if (stone[y][x] != 0) {
				if (stone[y][x] == 1) {
					pan = pan.replaceAt((y*17 + x + 18), "●");
				}
				if (stone[y][x] == 2) {
					pan = pan.replaceAt((y*17 + x + 18), "○");
				}
			}
		}
	}
	return pan;
}

// 학교 파싱 관련 전역 변수
var SW_UOSP1 = 2
var SW_UOSP2 = 2
var SW_UOSP3 = 2
var SW_UOSP4 = 2
var SW_UOSP5 = 2
var SW_UOSPKY = 2
var SW_hide = 2
var SW_thread_test = 0


thread_1 = new java.lang.Thread(new java.lang.Runnable(){
	run:function(){
		switcher = 1
		var is_printed = false
		try{
			setDB("Thread_Num",getNum("Thread_Num")+1)
			Api.replyRoom("봇장난","1번 스레드실행")
			while(1){
				if(switcher == 0){
					break
				}
				try{
					var date = new Date();
					
					//냠

					if(date.getHours()>7&&date.getHours()<20){ // 8~19시
						if(date.getSeconds()>-1&&date.getSeconds()<11&&SW_UOSP1==2){
							SW_UOSP1 = 1
						}
						else if(date.getSeconds()>9&&date.getSeconds()<21&&SW_UOSP2==2){
							SW_UOSP2 = 1
						}
						else if(date.getSeconds()>19&&date.getSeconds()<31&&SW_UOSP3==2){
							SW_UOSP3 = 1
						}
						else if(date.getSeconds()>29&&date.getSeconds()<41&&SW_UOSP4==2){
							SW_UOSP4 = 1
						}
						else if(date.getSeconds()>39&&date.getSeconds()<51&&SW_UOSP5==2){
							SW_UOSP5 = 1
						}
						else if(date.getSeconds()>49&&date.getSeconds()<61&&SW_UOSPKY==2){
							SW_UOSPKY = 1
						}
					}
					else{
						if(date.getMinutes()%5==0){
							if(date.getSeconds()>-1&&date.getSeconds()<11&&SW_UOSP1==2){
								SW_UOSP1 = 1
							}
							else if(date.getSeconds()>9&&date.getSeconds()<21&&SW_UOSP2==2){
								SW_UOSP2 = 1
							}
							else if(date.getSeconds()>19&&date.getSeconds()<31&&SW_UOSP3==2){
								SW_UOSP3 = 1
							}
							else if(date.getSeconds()>29&&date.getSeconds()<41&&SW_UOSP4==2){
								SW_UOSP4 = 1
							}
							else if(date.getSeconds()>39&&date.getSeconds()<51&&SW_UOSP5==2){
								SW_UOSP5 = 1
							}
							else if(date.getSeconds()>49&&date.getSeconds()<61&&SW_UOSPKY==2){
								SW_UOSPKY = 1
							}
						}
					}

					try{
						if(SW_UOSP1==1){
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP1 시작 : "+ new Date().date_format('HH:mm:ss'))
							}
							UOSP1()
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP1 종료 : "+ new Date().date_format('HH:mm:ss'))
							}
							SW_UOSP1 = 0
							SW_UOSPKY = 2
						}
					}
					catch(e){
						Api.replyRoom("봇장난","UOSP1 error \n"+e + "\n" + e.stack + "\n"+e.rhinoException);
					}
					try{
						if(SW_UOSP2==1){
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP2 시작 : "+ new Date().date_format('HH:mm:ss'))
							}
							UOSP2()
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP2 종료 : "+ new Date().date_format('HH:mm:ss'))
							}
							SW_UOSP2 = 0
							SW_UOSP1 = 2
						}
					}
					catch(e){
						Api.replyRoom("봇장난","UOSP2 error \n"+e + "\n" + e.stack + "\n"+e.rhinoException);
					}
					try{
						if(SW_UOSP3==1){
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP3 시작 : "+ new Date().date_format('HH:mm:ss'))
							}
							UOSP3()
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP3 종료 : "+ new Date().date_format('HH:mm:ss'))
							}
							SW_UOSP3 = 0
							SW_UOSP2 = 2
						}
					}
					catch(e){
						Api.replyRoom("봇장난","UOSP3 error \n"+e + "\n" + e.stack + "\n"+e.rhinoException);
					}
					try{
						if(SW_UOSP4==1){
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP4 시작 : "+ new Date().date_format('HH:mm:ss'))
							}
							UOSP4()
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP4 종료 : "+ new Date().date_format('HH:mm:ss'))
							}
							SW_UOSP4 = 0
							SW_UOSP3 = 2
						}
					}
					catch(e){
						Api.replyRoom("봇장난","UOSP4 error \n"+e + "\n" + e.stack + "\n"+e.rhinoException);
					}
					try{
						if(SW_UOSP5==1){
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP5 시작 : "+ new Date().date_format('HH:mm:ss'))
							}
							UOSP5()
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSP5 종료 : "+ new Date().date_format('HH:mm:ss'))
							}
							SW_UOSP5 = 0
							SW_UOSP4 = 2
						}
					}
					catch(e){
						Api.replyRoom("봇장난","UOSP5 error \n"+e + "\n" + e.stack + "\n"+e.rhinoException);
					}
					try{
						if(SW_UOSPKY==1){
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSPKY 시작 : "+ new Date().date_format('HH:mm:ss'))
							}
							UOSPKY()
							if(SW_thread_test==1){
								Api.replyRoom("고양이 사진방","UOSPKY 종료 : "+ new Date().date_format('HH:mm:ss'))
							}
							SW_UOSPKY = 0
							SW_UOSP5 = 2
						}
					}
					catch(e){
						Api.replyRoom("봇장난","UOSPKY error \n"+e + "\n" + e.stack + "\n"+e.rhinoException);
					}

					java.lang.Thread.sleep(3000) // 200ms
				}
				catch(e){
					Api.replyRoom("봇장난","thread 1 SW error \n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
			}
		}catch(e){
			Api.replyRoom("봇장난","thread 1 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
		}
		finally{
			Api.replyRoom("봇장난","1번 스레드종료")
		}
	}
}, "kbot_thread_1");


clock = new java.lang.Thread(new java.lang.Runnable(){
	run:function(){
		switcher = 1
		var is_printed = false
		try{
			setDB("Thread_Num",getNum("Thread_Num")+1)
			Api.replyRoom("봇장난","clock 스레드실행")
			while(1){
				if(switcher == 0){
					break
				}
				/*
				try{ // clock_minute 꺼졌을시 재시동
					if(clock_minute.isAlive()==false && updateStart==0 ){
						clock_minute.start()
						Api.replyRoom("봇장난","clock_minute 스레드 재시동")
					}
				}
				catch(e){
					Api.replyRoom("봇장난","clock-1 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
				try{ // clock_3minute 꺼졌을시 재시동
					if(clock_3minute.isAlive()==false && updateStart==0 ){
						clock_3minute.start()
						Api.replyRoom("봇장난","clock_3minute 스레드 재시동")
					}
				}
				catch(e){
					Api.replyRoom("봇장난","clock-2 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
				*/

				try{
					var date = new Date();
					if(date.getHours()>8 && date.getHours()<17 && (date.getDay()>0&&date.getDay()<6) ){
						//KOSPI_control();
						//KOSDAQ_control();
						KOSPI_periodic_parse();
						KOSDAQ_periodic_parse();
					}
				}
				catch(e){
					//Api.replyRoom("봇장난","KOSPI error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
				try{
					var date = new Date();
					if(date.getHours()>22 || date.getHours()<7 || (date.getHours()==22 || date.getMinutes()>29) && (date.getDay()>0&&date.getDay()<7) ){
						//NASDAQ_control();
						NASDAQ_periodic_parse();
					}
				}
				catch(e){
					//Api.replyRoom("봇장난","NASDAQ error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
				try{
					var date = new Date();
					if(date.getMinutes()==59){
						WTI_flag = 1
					}
				}
				catch(e){
					//Api.replyRoom("봇장난","WTI_flag error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
				try{
					var date = new Date();
					if(date.getMinutes()==0 && date.getHours()%3==0 && WTI_flag == 1 && (date.getDay()>0&&date.getDay()<6) ){
						var WTI_Temp_T = WTI_parse()
						sendKalingImage("시립주식",WTI_Temp_T[2],"","WTI","",318,159)
						Api.replyRoom("시립주식",WTI_Temp_T[0])
						Api.replyRoom("시립주식",WTI_Temp_T[1])
						//sendKalingImage("시립주식","","",WTI_Temp_T[0],"","","")
						//sendKalingImage("시립주식","","",WTI_Temp_T[1],"","","")
						WTI_flag = 0
					}
				}
				catch(e){
					//Api.replyRoom("봇장난","WTI error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}

				// =====================================================================================================
				// 장전 요약방송 =======================================================================================
				try{
					var date = new Date();
					if((date.getMinutes()==48||date.getMinutes()==49) && date.getHours()== 8 && comment_flag == 0 && (date.getDay()>0&&date.getDay()<6) ){
					//if(date.getMinutes()==9 && date.getHours()== 19 && comment_flag == 0){
						comment_flag = 1
					}
				}
				catch(e){
					Api.replyRoom("봇장난","comment_flag error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
				try{
					var date = new Date();
					if((date.getMinutes()==50||date.getMinutes()==51) && date.getHours()==8 && comment_flag == 1 && (date.getDay()>0&&date.getDay()<6) ){
					//if(date.getMinutes()==10 && date.getHours()== 19 && comment_flag == 1){
						var str_comment = Stock.start_summary()
						Api.replyRoom("시립주식","장전 "+str_comment)
						Api.replyRoom("웅앙농장","장전 "+str_comment)
						Api.replyRoom("시립대 주식방","장전 "+str_comment)

						comment_flag = 0
					}
				}
				catch(e){comment_flag = 1
					Api.replyRoom("봇장난","comment error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}

				try{
					var date = new Date();
					if((date.getMinutes()==58||date.getMinutes()==59) && (date.getHours()== 9||date.getHours()== 12||date.getHours()== 15) && comment_flag == 0 && (date.getDay()>0&&date.getDay()<6) ){
						//if(date.getMinutes()==9 && date.getHours()== 19 && comment_flag == 0){
						comment_flag = 1
					}
				}
				catch(e){
					Api.replyRoom("봇장난","comment_flag error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}
				try{
					var date = new Date();
					if((date.getMinutes()==0||date.getMinutes()==1) && (date.getHours()== 10||date.getHours()== 13||date.getHours()== 16) && comment_flag == 1 && (date.getDay()>0&&date.getDay()<6) ){
						//if(date.getMinutes()==10 && date.getHours()== 19 && comment_flag == 1){
						var str_comment = Stock.start_summary()
						Api.replyRoom("시립주식",str_comment)
						Api.replyRoom("웅앙농장",str_comment)
						Api.replyRoom("시립대 주식방",str_comment)

						comment_flag = 0
					}
				}
				catch(e){comment_flag = 1
					Api.replyRoom("봇장난","comment error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
				}

				// =====================================================================================================
				// =====================================================================================================



				java.lang.Thread.sleep(10000) //10sec
			}
		}catch(e){
			Api.replyRoom("봇장난","clock error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
		}
		finally{
			Api.replyRoom("봇장난","clock 스레드종료")
		}
	}
}, "kbot_thread_clock");

clock_minute = new java.lang.Thread(new java.lang.Runnable({
	run:function(){
		switcher_minute = 1
		var is_printed = false
		try{
			Api.replyRoom("봇장난","clock_minute 스레드실행")
			while(1){
				if(switcher == 0){
					break
				}

				/*
				var date = new Date();
				try{
					if(date.getMinutes()==0){
						clearHourDB() // 시간
					}
				}
				catch(e){
					Api.replyRoom("봇장난","clock_minute-2 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException+"\n\nMessage start\n"+e.message+"Message end");
				}
				try{
					if(date.getMinutes()==0&&date.getHours()==0){
						//Api.replyRoom("시갤톡방","지난 1일동안 톡방 전체 채팅량 : "+sumDB("시갤톡방","day")+"회")
						//Api.replyRoom("시갤톡방","지난 1일동안 최고의 TMI : "+getDB("DB시갤톡방_"+searchMaxDB("시갤톡방","day").split("||")[0]).split("||")[1]+" ("+searchMaxDB("시갤톡방","day").split("||")[1]+"회)")
						clearDayDB() // 일DB
					}

				}
				catch(e){
					Api.replyRoom("봇장난","clock_minute-3 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException+"\n\nMessage start\n"+e.message+"Message end");
				}
				*/
				/*
				try{

					if((date.getHours()==16&&date.getDay()!=6&&date.getDay()!=0&&date.getMinutes()>50)||(date.getHours()==17&&date.getMinutes()<40)){
						dream_status = "selfStudy";
					}
					else if((date.getHours()>8&&date.getDay()!=6&&date.getDay()!=0&&date.getHours()<16)||(date.getHours()==16&&date.getMinutes()<50)){
						dream_status = "Study";
					}
					else{
						dream_status = "normal";
					}

				}
				catch(e){
					Api.replyRoom("봇장난","clock_minute-4 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException+"\n\nMessage start\n"+e.message+"Message end");
				}
				*/


				//===============================================================================================

				/*
				try{ // clock 꺼졌을시 재시동
					if(clock.isAlive()==false && updateStart==0 ){
						clock.run()
					}
				}
				catch(e){
					Api.replyRoom("봇장난","clock_minute-1 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException+"\n\nMessage start\n"+e.message+"Message end");
				}
				*/

				//===============================================================================================

				/*
				try{
					java.lang.Thread.sleep(600000) //1sec
					UOS_Time_DB_update("2019","A10","U")
					//Api.replyRoom("봇장난","UOSP3작동")
				}catch(e){
					Api.replyRoom("봇장난","2019 prasing error\n"+e + "\n" + e.stack + "\n" + e.rhinoException + "\n" + e.lineNumber);
					java.lang.Thread.sleep(15000) //1sec
				}
				*/

				/*
				try{
					java.lang.Thread.sleep(600000) //1sec
					UOS_Time_DB_update("2019","A10","U")
					//Api.replyRoom("봇장난","UOSP3작동")
				}catch(e){
					Api.replyRoom("봇장난","2019 prasing error\n"+e + "\n" + e.stack + "\n" + e.rhinoException + "\n" + e.lineNumber);
					java.lang.Thread.sleep(15000) //1sec
				}
				*/


				/*
				try{
					java.lang.Thread.sleep(5000) //1sec
					sugang()
					//Api.replyRoom("봇장난","UOSP1작동")
				}catch(e){
					Api.replyRoom("봇장난","sugang error\n"+e + "\n" + e.stack + "\n" + e.rhinoException + "\n" + e.lineNumber);
					java.lang.Thread.sleep(15000) //1sec
				}
				*/



				java.lang.Thread.sleep(60000) //1sec
			}
		}catch(e){
			Api.replyRoom("봇장난","clock_minute error\n"+e + "\n" + e.stack + "\n"+e.rhinoException+"\n\nMessage start\n"+e.message+"Message end");
		}

		finally{
			Api.replyRoom("봇장난","clock_minute 스레드종료")
		}

	}
}, "kbot_thread_clock_minute"));



thread_UOSP1 = new java.lang.Thread(new java.lang.Runnable({
	run:function(){
		switcher = 1
		//var is_printed = false
		try{
			Api.replyRoom(console_room_name,"일반공지 파싱 스레드 실행")
			while(1){
				if(switcher == 0){
					break
				}

				try{
					var date = new Date();
					if( date.getHours()>8 && date.getHours()<22 ){
						UOSP.UOSP1()
					}
				}
				catch(e){
					java.lang.Thread.sleep(30000)
				}

				java.lang.Thread.sleep(30000) //10sec
			}
		}catch(e){
			Api.replyRoom(console_room_name,"일반공지 파싱 스레드 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
		}
		finally{
			Api.replyRoom(console_room_name,"일반공지 파싱 스레드 종료")
		}
	}
}), "katalkbot_thread_UOSP1");



thread_UOSP_control = new java.lang.Thread(new java.lang.Runnable({
	run:function(){
		switcher = 1
		let SW = 0 // 0 : 꺼짐, 1 : 작동대기, 2 : 작동후
		//var is_printed = false
		try{
			Api.replyRoom(console_room_name,"학과공지 파싱 스레드 실행")
			while(1){
				if(switcher == 0){
					break
				}

				try{
					var date = new Date();
					if( (date.getHours()==12||date.getHours()==15||date.getHours()==18) && SW == 2 ){
						SW = 0
					}
					if( (date.getHours()==11||date.getHours()==14||date.getHours()==17) && SW == 0 ){
						SW = 1
					}
					if( date.getHours()>8 && date.getHours()<22 ){
						try{ UOSP.UOSP2() }catch(e){}

						for(let i=0 ; i<23 ; i++){
							try{
								UOSP.UOS_temp_controller(String(i))
								java.lang.Thread.sleep(1000)
							} catch(e){}
						}

						if(SW==1){
							UOSP.UOS_temp_controller("1","ON")
							SW = 2
						}

					}
				}
				catch(e){
					java.lang.Thread.sleep(300000)
				}

				java.lang.Thread.sleep(300000) //10sec
			}
		}catch(e){
			Api.replyRoom(console_room_name,"학과공지 파싱 스레드 error\n"+e + "\n" + e.stack + "\n"+e.rhinoException);
		}
		finally{
			Api.replyRoom(console_room_name,"학과공지 파싱 스레드 종료")
		}
	}
}), "katalkbot_thread_UOSP_control");

console={
	log:function (msg){
		Api.replyRoom("봇장난",msg)
	}
}


function TEST(){
	Api.replyRoom("봇장난", "정상작동")
	return 1;
}


Date.prototype.date_format = function (f) {
	if (!this.valueOf()) return " ";

	var weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
	var weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {

		switch ($1) {
			case "yyyy": return d.getFullYear(); // 년 (4자리)
			case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
			case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
			case "dd": return d.getDate().zf(2); // 일 (2자리)
			case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
			case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
			case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
			case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
			case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
			case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
			case "mm": return d.getMinutes().zf(2); // 분 (2자리)
			case "ss": return d.getSeconds().zf(2); // 초 (2자리)
			case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
			default: return $1;
		}
	});
};
String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };


