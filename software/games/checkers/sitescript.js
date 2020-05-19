// 7is7.com Sitewide scripting
// Copyright 2007-2013 (C) Otto de Voogd

// Open new window
function openWin(src,target) {
	if ("undefined"==typeof(target)||''==target) {target='_blank';}
	newwin=window.open(src.getAttribute('href'),target,'width=800,height=600,toolbar=yes,status=yes,location=yes,menubar=yes,directories=yes,resizable=yes,scrollbars=yes');
	if(window.focus){newwin.focus()};
	return(false);
}

// Init
function init() {
	// Break out of frames - disabled 2013-02-25
	// if (top!=self) {top.location.replace(self.location.href);}
	// Set new window target
	if (document.getElementsByTagName) {
		var as=document.getElementsByTagName("a");
		for (var i=0;i<as.length;i++) {
			var a=as[i];
			if (a.getAttribute("href") && a.getAttribute("rel") && a.getAttribute("rel").match("(^| )win( |$)"))
				a.target="_blank";
		}
	}
}

window.onload=init;

// TIAF!
