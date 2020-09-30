var addsuccess = false ;

function loadjscssfile(filename, filetype){
 addsuccess = false ;	
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", filename);
 }
 var m0 = document.getElementsByTagName("head")[0].childNodes;
 var origlength = m0.length ;

 if (typeof fileref!="undefined") {
    document.getElementsByTagName("head")[0].appendChild(fileref) ;
 }
 
 var m1 = document.getElementsByTagName("head")[0].childNodes;
 var newlength = m1.length ;

 if (newlength>origlength)
    addsuccess = true ;
 
 return addsuccess ;
}

var filesadded="" ; //list of files already added	

function checkloadjscssfile(filename, filetype){
 if (filesadded.indexOf("["+filename+"]")==-1){
  loadjscssfile(filename, filetype)
  filesadded+="["+filename+"]" //add to list of files already added, in the form of "[filename1],[filename2],etc"
 }
 else
  alert("file already added!")
}

function removejscssfile(filename, filetype){
 var removedelements=0
 var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist using
 var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
 var allsuspects=document.getElementsByTagName(targetelement)
 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
   allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
   removedelements+=1
  }
 }
}

function createjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
 }
 return fileref
}

function replacejscssfile(oldfilename, newfilename, filetype){
 var replacedelements=0
 var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist using
 var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
 var allsuspects=document.getElementsByTagName(targetelement)
 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!=-1){
   var newelement=createjscssfile(newfilename, filetype)
   allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
   replacedelements+=1
  }
 }
 if (replacedelements>0)
  alert("Replaced "+replacedelements+" instances of "+oldfilename+" with "+newfilename)
}

var fnSign = function () {
    var div1 = Ext.get('signin_button');
    var div2 = Ext.get('profile_menu');
    
    if (!div1.hasClass("menu-open")) {
    	div1.addClass ("menu-open") ;        
        div2.removeClass ("offscreen") ;		     
    }
    else {
		div1.removeClass ("menu-open") ;        
        div2.addClass ("offscreen") ;		    
    } 
}

function textStatus (txtStatus, autoclear, isbusy) {
	var sb = Ext.getCmp('basic-statusbar');
	sb.clearStatus(); 
	if (isbusy) {
		sb.setStatus({
	        busyText: txtStatus,
	        clear: autoclear 
	    });
		sb.showBusy() ;
	}
	else {
		sb.setStatus({
	        text: txtStatus,
	        clear: autoclear 
	    });
	}
}

function resetPresentation () {
    var div1 = Ext.get('presentation').dom ;
	div1.innerHTML = '<div id="_placeholder"></div>' ;
}
var scid = '' ;
var current_app = null ;

function setContext (parscid) {
	scid = parscid ;
}
function launchapp (app) {
	var NEVER_DEFINED ;
	
	textStatus ('Loading application ' + app + '...', false, true) ;
    resetPresentation () ;
    
    if (current_app != null) 
    	removejscssfile(current_app, 'js') ;
    	
    current_app = '../app/' + app + '.jsp?app=' + app + '&sc=' + scid ;
	var cnt = 100 ;

	var fnloader = function () {
		if (typeof run_launcher!="undefined") {
			run_launcher.defer(100, this) ;
			textStatus ('Application ' + app + ' loaded', true, false) ;
		}
		else { 
			cnt -- ;
			if (cnt>=0) 
				fnloader.defer (500, this) ;
			else
				textStatus ('Load application ' + app + ' failed', true, false) ;
				
		}
	}

	run_launcher = NEVER_DEFINED ;
    loadjscssfile(current_app,'js') ;
    fnloader.defer(500, this) ;
}