// GLOBAL VARIABLE 
	window.stage3objects = {};
	window.planCards = new PlanItems();
	window.gUsage = {};
	window.ddlYears_nochange = false; // change flag for years dropdown list in age

$(function() {
	// close all of the main sections
	assCollapseAll();
	
	// any click in the report will trigger a GA event to start the report
	$('.groupdivision').click(function() {
        setUsage('Report','Start');
    });
	
	// close the menu when clicking anywhere else
	$('#mainbodycontainer').click(function() {
        closeMenu();
    });
	
	// calculate age
	$('#txtPers_bd_month, #txtPers_bd_day, #txtPers_bd_year').on('keyup click paste', function() {
        calc_age();
    });
	
	// change age
	$('#txtPers_age').on('keyup click paste', function() {
		$('#txtAge').val($('#txtPers_age').val());
    });
	$('#txtAge').on('keyup click paste', function() {
		$('#txtPers_age').val($('#txtAge').val());
    });
	$('#ddlPers_years').change(function() {
		if (!ddlYears_nochange) {
			ddlYears_nochange = true;
			$('#ddlYears').val($('#ddlPers_years').val()).change();
			ddlYears_nochange = false;
		}
    });
	$('#ddlYears').change(function() {
		if (!ddlYears_nochange) {
			ddlYears_nochange = true;
			$('#ddlPers_years').val($('#ddlYears').val()).change();
			ddlYears_nochange = false;
		}
    });
	// change sex
	$("input[type=radio][name='rbPers_gender']").change(function () {
		$("input[type=radio][name='rbGender'][value='" + $("input[type=radio][name='rbPers_gender']:checked").val() + "']").prop('checked', true);
	});
	$("input[type=radio][name='rbGender']").change(function () {
		$("input[type=radio][name='rbPers_gender'][value='" + $("input[type=radio][name='rbGender']:checked").val() + "']").prop('checked', true);
	});
	
	// other for incident disposition
	$('#ddlInc_disposition').change(function () {
		var disposition = getDLelem('ddlInc_disposition');
		if (disposition === 'Other') {
			$('#txtInc_disposition_show').css('display', 'inline');
		} else {
			$('#txtInc_disposition_show').css('display', 'none');
		}
	});
	
	// copy address from incident
	$('#txtInc_loc_address, #txtInc_loc_room, #txtInc_loc_city, #txtInc_loc_state, #txtInc_loc_zip').focusout(function () {
		copy_address_to_patient();
	});
	
	// locations
	$('#txtInc_loc_w3w').keyup(function () {
		if (w3w_submit( $(this).val() )) {
			getW3W_suggestion ( $(this).val() );
		}
	});
	$('#txtInc_loc_w3w').blur(function () {
		// needs delay to catch click on suggestions
		setTimeout(function(){ 
			$('#w3wInc_suggestions').hide(); 
			var gps_text = getTXelem('txtInc_loc_gpslat');
			var w3w = getTXelem('txtInc_loc_w3w');
			if (gps_text === '') {
				getW3W_gps(w3w);
			}
			setW3W_maps_link();
		}, 100);
	});
	$('#txtInc_loc_gpslat, #txtInc_loc_gpslong').blur(function () {
		var gps_lat = getTXelem('txtInc_loc_gpslat');
		var gps_long = getTXelem('txtInc_loc_gpslong');
		if (gps_lat !== '' && gps_long !== '') {
			getW3W_from_gps(gps_lat, gps_long);
		}
		setGoogle_maps_link();
	});
	
	
	
	// copy banner from top into the bottom before create report button
	var b = $('#banner').clone();
	$(b).find("[id]").add(b).each(function() {
        this.id = this.id + 'dupe';
    });
	$('#banner2').append(b);
	
	// get state of CHART selection
	if (storageAvailable('localStorage')) {
		if(localStorage.getItem('chart') === 'true') {
			$('#chart_button').prop('checked', true);
		}
	}
	// warn if leaving the page
	//$(window).bind('beforeunload', function(){
	//	  return 'Are you sure you want to leave? Your report data will be lost!';
	//});
	
	// events for assessment specific
	$('#divASSPEC input[type=checkbox]').change(function (){
		show_asspec();
	});
	$('#ASSPEC_BIRTH_table1 td').click(function () {
		$('#ASSPEC_BIRTH_1score').html(' score = ' + apgar_score1());
	});
	$('#ASSPEC_BIRTH_table5 td').click(function () {
		$('#ASSPEC_BIRTH_5score').html(' score = ' + apgar_score5());
	});
	
});

// hide the menu
function closeMenu() {
    if (window.headerMenu && typeof window.headerMenu.close === 'function') {
        window.headerMenu.close();
    } else {
        $('#HDR_mainmenu').hide();
        $('#HDR_mask').hide();
    }
}

//checks to see if storage is available, from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
 try {
     var storage = window[type],
         x = '__storage_test__';
     storage.setItem(x, x);
     storage.removeItem(x);
     return true;
 }
 catch(e) {
     return e instanceof DOMException && (
         // everything except Firefox
         e.code === 22 ||
         // Firefox
         e.code === 1014 ||
         // test name field too, because code might not be present
         // everything except Firefox
         e.name === 'QuotaExceededError' ||
         // Firefox
         e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
         // acknowledge QuotaExceededError only if there's something already stored
         storage.length !== 0;
 }
}

function add_personnel_to_incident() {
	var rows = $('#tblInc_personnel tr').length;
	var html = "<tr><td><input id='txtInc_personnel" + formatNumber4(rows) + "_name' class='txtmedium'></td><td><input id='txtInc_personnel" + formatNumber4(rows) + "_role'></td></tr>"
	$('#tblInc_personnel').append(html);
}

function calc_age() {
	var input_month = getTXelem('txtPers_bd_month');
	var input_day = getTXelem('txtPers_bd_day');
	var input_year = getTXelem('txtPers_bd_year');
	if (input_month === '' || input_day === '' || input_year === '' || input_year < 1900) { return; }
	
	var input_date = new Date(input_year, input_month-1, input_day);
	var current_date = new Date();
	
	difference_results = date_difference(input_date, current_date);
	if (difference_results[0] > 0) { // years
		$('#txtPers_age').val(difference_results[0]);
		$('#ddlPers_years').val('year old').change();
		$('#txtAge').val(difference_results[0]);
		$('#ddlYears').val('year old').change();
	} else {
		if (difference_results[1] > 0) { // months
			$('#txtPers_age').val(difference_results[1]);
			$('#ddlPers_years').val('month old').change();
			$('#txtAge').val(difference_results[1]);
			$('#ddlYears').val('month old').change();
		} else { // days
			if (difference_results[2] === 0) {difference_results[2] = 1}
			$('#txtPers_age').val(difference_results[2]);
			$('#ddlPers_years').val('day old').change();
			$('#txtAge').val(difference_results[2]);
			$('#ddlYears').val('day old').change();
		}
	}
}

function date_difference (date1, date2) {
	if (date1 > date2) {
		var date_hold = new Date(date1.getTime());
		date1 = new Date(date2.getTime());
		date2 = new Date(date_hold.getTime());
	}
	var endYear = date2.getFullYear();
	var endMonth = date2.getMonth();
	var years = endYear - date1.getFullYear();
	var months = endMonth - date1.getMonth();
	var days = date2.getDate() - date1.getDate();
	
	if (months < 0) {
	    years -= 1;
	    months += 12;
	}
	if (days < 0) {
	    months -= 1;
	    days += new Date(endYear, endMonth, 0).getDate();
	}
	return [years, months, days];
}
// toggles between 2 sets of information when awake/unconscious is selected
function setMent() {
    if ($('#rbAlert').prop('checked')) {
    	$('#MentAlert').css('display', 'inline');
    	$('#MentNotAlert').hide();
    } else {
    	$('#MentNotAlert').css('display', 'inline');
    	$('#MentAlert').hide();
    }
}

function setReportHeight() {
	$('#txtReport').height( $('#txtReport').prop('scrollHeight') );
}

function copy_address_to_patient() {
	var pt_address = getTXelem('txtPers_loc_address');
	var pt_room = getTXelem('txtPers_loc_room');
	var pt_city = getTXelem('txtPers_loc_city');
	var pt_state = getTXelem('txtPers_loc_state');
	var pt_zip = getTXelem('txtPers_loc_zip');
	var inc_address = getTXelem('txtInc_loc_address');
	
	if (pt_address === '' && pt_room === '' && pt_city === '' && pt_state === '' && pt_zip === '') {
		setTXelem('txtPers_loc_address', getTXelem('txtInc_loc_address'));
		pt_address = getTXelem('txtPers_loc_address');
	}
	if (pt_address === inc_address && pt_room === '') {
		setTXelem('txtPers_loc_room', getTXelem('txtInc_loc_room'));
	}
	if (pt_address === inc_address && pt_city === '') {
		setTXelem('txtPers_loc_city', getTXelem('txtInc_loc_city'));
	}
	if (pt_address === inc_address && pt_state === '') {
		setTXelem('txtPers_loc_state', getTXelem('txtInc_loc_state'));
	}
	if (pt_address === inc_address && pt_zip === '') {
		setTXelem('txtPers_loc_zip', getTXelem('txtInc_loc_zip'));
	}
}


// --------- FUNCTIONS DEALING WITH THE 3 STAGE CHECKBOX ---------------------------------------------------------

// ***********************************
//name: addobject
//var:  oid - string, id of the section ie. HD, NK
//      obj3 - array, for each item {html image id, html title id, name of item, 3 stage state, natural state, html text id} 
//return: none
//
//desc: adds a stage3 object to the global variable stage3object
//      this is used in soapcr.php
// ************************************
function addobject (oid, obj3) {
	stage3objects[oid] = obj3;
}

// ***********************************
// name: change3state
// var:  secid - string, id of the section ie. HD, NK
//       secnum - string, 2 digit number of the item in the group
// return: none
// 
// desc: rotate the image of the checkbox through the 3 states none, -, +
//       also stores the state in the object
// ************************************
function change3state(secid, secnum) {
    var s3img = $('#s3' + secid + formatNumber2(secnum) + 'img');

    switch (gets3state(secid, secnum)) {
        case 1:
            s3img.attr("src","/public/images/3stage2.svg");  // change to the next image in the sequence
            s3img.attr("alt", "\u2612");         // minus sign if no image found
            sets3state(secid, secnum, 2);       // set the new state 
            s3displayText(secid, secnum);		// display the textbox if appropriate
            break;
        case 2:
            s3img.attr("src","/public/images/3stage3.svg");
            s3img.attr("alt","\u2611");			// + sign if no image found
            sets3state(secid, secnum, 3);
            s3displayText(secid, secnum);
            break;
        case 3:
            s3img.attr("src","/public/images/3stage1.svg");
            s3img.attr("alt","\u2610");			// empty box if no image found
            sets3state(secid, secnum, 1);
            s3displayText(secid, secnum);
            break;
        default:
        	s3img.attr("src","/public/images/3stage1.svg"); // if for some reason there is no state, reset to the first image
        	s3img.attr("alt","\u2610");
            sets3state(secid, secnum, 1);
            s3displayText(secid, secnum);
    }
}


//***********************************
//name: gets3state
//var:  secid - string, id of the section ie. HD, NK
//      secnum - string, 2 digit number of the item in the group
//return: none
//
//desc: get the 3 stage state of an s3 object
//************************************
function gets3state(secid, secnum) {
    return stage3objects[secid][secnum-1].state3;
}


//***********************************
//name: sets3state
//var:  secid - string, id of the section ie. HD, NK
//      secnum - string, 2 digit number of the item in the group
//      setstate - integer, the new state
//return: none
//
//desc: set the 3 stage state of an s3 object
//************************************
function sets3state(secid, secnum, setstate) {
    stage3objects[secid][secnum-1].state3 = setstate;
}


//***********************************
//name: s3displayText
//var:  secid - string, id of the section ie. HD, NK
//    secnum - string, 2 digit number of the item in the group
//return: none
//
//desc: display the textbox if appropriate
//************************************
function s3displayText(secid, secnum) {
	var stateval = stage3objects[secid][secnum-1].state3;
	var nat = stage3objects[secid][secnum-1].natural;
	if (stateval == 3 && nat) { // box is positive and natural state is true then display
		$('#s3' + secid + formatNumber2(secnum) + 'txtblock').slideDown('slow');
	} else {
		if (stateval == 2 && !nat) { // box is negative and natural state is false then display
			$('#s3' + secid + formatNumber2(secnum) + 'txtblock').slideDown('slow');
		} else {						// else hide
			$('#s3' + secid + formatNumber2(secnum) + 'txtblock').slideUp('slow');
		}
	}
}


//***********************************
//name: formatNumber2
//var:  num2fmt - integer
//return: string
//
//desc: convert a number to a 2 character string
//************************************
function formatNumber2(num2fmt) {
    var numStr = String;

    if (num2fmt < 10) {
        numStr = "0" + num2fmt;
    }
    else {
        numStr = num2fmt;
    }
    return numStr;
}
function formatNumber4(num) {
	if (num < 10)    { return  '000' + num.toString(); }
	if (num < 100)   { return   '00' + num.toString(); }
	if (num < 1000)  { return    '0' + num.toString(); }
	return num.toString();
}

// -------------------------- P L A N   F U N C T I O N S -------------------------------------------
// object definition
function PlanItems () {
	// planList data structure
	// planList - array of the following properties, 'position' is defined as array position in this list
	//      id - string, id of card HTML div element
	//		name - string, name of card
	//	    type - id, but does not change with an added number at the end, used for writepcr.js
	//		order - integer, visual order of the cards created by this.setOrder
	//		time - string, internal time created by this.setTime
	//		timeid - string, id of HTML time input element
	this.planList = [];
	this.rcount = 0; // running count, not necessarily the length (if something gets deleted)
	this.viscount = 0; // actual number of visible cards (can be less than rcount because of deleted cards)
	this.customElements = []; // data for custom plans

	// EXTERNAL clones a plan card from the template, change ids on the card, add to planList
	this.addCard = function (pid, pname) {
		if ($('#' + pid) !== null) {
			this.rcount += 1;
			var cardhtml = $('#' + pid).clone(); // clone
			var newid = this.changeIDs(cardhtml); // change the id's in the clone and get the new number
			var timeid = $('#' + pid + ' input').first().attr('id');
			timeid = timeid + newid; // notate the new timeid
			this.planList.push( {id: pid + newid, name: pname, type: pid, timeid: timeid, order: this.count, time: ''} ); // add the clone to the list
			this.setVisCount();
			$('#planContainer').append(cardhtml); // add the clone to the html
			planShowNav(this.viscount); // show the navigation
		}
	};
	
	// INTERNAL add new number to the end of  clone attributes id, for and name
	this.changeIDs = function (pcard) {
		var cntr = this.rcount;
		var cntrID = this.num2str4(cntr);
	    $(pcard).find("[id]").add(pcard).each(function() {
	        this.id = this.id + cntrID;
	    });
	    $(pcard).find("[for]").add(pcard).each(function() {
	    	if ($( this ).attr('for') !== undefined) {
		    	newattr =$( this ).attr('for') + cntrID;
		    	$( this ).attr('for', newattr);
	    	}
	    });
	    $(pcard).find("[name]").add(pcard).each(function() {
	    	if ($( this ).attr('name') !== undefined) {
		    	newattr =$( this ).attr('name') + cntrID;
		    	$( this ).attr('name', newattr);
	    	}
	    });
	    return cntrID; // return the 4 string integer that makes up the new card
	};
	
	// EXTERNAL clones a plan card from the template, change to specific ids on the card, add to planList (used for setting the data)
	this.addCardSpecificId = function (pid, pname, counter_id) {
		if ($('#' + pid) !== null) {
			if (counter_id > this.rcount) {
				this.rcount = counter_id;
			}
			var cardhtml = $('#' + pid).clone(); // clone
			var newid = this.changeIDsSpecificId(cardhtml, counter_id); // change the id's in the clone and get the new number
			var timeid = $('#' + pid + ' input').first().attr('id');
			timeid = timeid + newid; // notate the new timeid
			this.planList.push( {id: pid + newid, name: pname, type: pid, timeid: timeid, order: this.count, time: ''} ); // add the clone to the list
			this.setVisCount();
			$('#planContainer').append(cardhtml); // add the clone to the html
			planShowNav(this.viscount); // show the navigation
		}
	};
	
	// INTERNAL add specific number to the end of  clone attributes id, for and name (used for set the data)
	this.changeIDsSpecificId = function (pcard, counter_id) {
		var cntr = counter_id;
		var cntrID = this.num2str4(cntr);
	    $(pcard).find("[id]").add(pcard).each(function() {
	        this.id = this.id + cntrID;
	    });
	    $(pcard).find("[for]").add(pcard).each(function() {
	    	if ($( this ).attr('for') !== undefined) {
		    	newattr =$( this ).attr('for') + cntrID;
		    	$( this ).attr('for', newattr);
	    	}
	    });
	    $(pcard).find("[name]").add(pcard).each(function() {
	    	if ($( this ).attr('name') !== undefined) {
		    	newattr =$( this ).attr('name') + cntrID;
		    	$( this ).attr('name', newattr);
	    	}
	    });
	    return cntrID; // return the 4 string integer that makes up the new card
	};

	// INTERNAL convert number to 4 character string
	this.num2str4 = function (num) {
		if (num < 10)    { return  '000' + num.toString(); }
		if (num < 100)   { return   '00' + num.toString(); }
		if (num < 1000)  { return    '0' + num.toString(); }
		return num.toString();
	};
	
	// INTERNAL set actual visible card count
	this.setVisCount = function () {
		this.viscount = this.planList.length;
	};

	// EXTERNAL actually remove the card from the html and the object array
	this.removeCard = function (id) {
		var pos = this.findCard(id);
		if (pos >= 0) {
			this.planList.splice(pos, 1); // remove 1 record from the array
			this.setVisCount();
			$('#' + id).remove();
			planShowNav(this.viscount);
		}
	};

	// EXTERNAL remove all cards from the html and the object array
	this.removeAllCards = function () {
		/*
		for (var i=0; i< this.planList.length; i++) {
			$('#' + this.planList[i].id).remove();
		}
		*/
		$('#planContainer').empty();
		this.planList = [];
		this.rcount = 0;
		this.viscount = 0;
		planShowNav(this.viscount);
	};

	// INTERNAL finds the card based on the id in the card objects and returns which array position it is in
	this.findCard = function (id) {
		for (var x=0; x < this.planList.length; x++) {
			if (this.planList[x].id == id) {
				return x;
			}
		}
		return -1;
	};
	
	// INTERNAL find the card based on the order number, returns which array position it is in
	// for looping through the visual order of the cards
	this.findCardOrder = function (ord) {
		for (var x=0; x < this.planList.length; x++) {
			if (this.planList[x].order === ord) {
				return x;
			}
		}
		return -1;
	};
	
	// EXTERNAL sort cards in this order
	// PTA
	// non-time cards prior to first card with a time
	// time cards in order
	// non-time cards after the first card with a time
	this.sortCards = function () {
		this.setOrder();
		this.fix4overlapTime();
		var arPTA = []; // array of positions for PTA times
		var arBlank1 = []; // array of positions for first set of blanks
		var arTime = []; // array of positions for cards with times
		var arBlank2 = []; // array of positions for second set of blanks
		var posHold = -1; // temp to hold the current position
		// find array positions of PTA
		for (var i=0; i < this.planList.length; i++) {
			posHold = this.findCardOrder(i);
			if ( this.planList[posHold].time === "PTA" ) {
				arPTA.push(posHold); // add new position
			}
		}
		
		// firstTimePos = array position of first time
		var firstTime = 9999; // the first time
		var firstTimePos = -1; // position of the first time
		var firstTimeOrder = 9999; // order of the first time
		var intTime = 0;
		for (var j=0; j < this.planList.length; j++) {
			posHold = this.findCardOrder(j);
			if ( this.isTime(this.planList[posHold].time).type === "TIME" ) {
				firstTimePos = posHold;
				firstTimeOrder = this.planList[posHold].order;
				break;
			}
		}
		
		// find array positions of blank prior to firstTimeOrder
		for (var k=0; k < this.planList.length; k++) {
			posHold = this.findCardOrder(k);
			if ( this.isTime(this.planList[posHold].time).type === "NONE" && this.planList[posHold].order < firstTimeOrder ) {
				arBlank1.push(posHold); // add new position
			}
		}
		
		// array position of sort order of cards with a time
		for (i=0; i < this.planList.length; i++) {
			posHold = this.findCardOrder(i);
			if ( this.isTime(this.planList[posHold].time).type === "TIME" ) {
				arTime.push(posHold); // add new position
			}
		}
		// sort the arTime array
		var hthis = this;
		arTime.sort(function(a, b) {return parseInt(hthis.planList[a].time) - parseInt(hthis.planList[b].time);});
		
		// find array positions of blank after firstTime
		for (i=0; i < this.planList.length; i++) {
			posHold = this.findCardOrder(i);
			if ( this.isTime(this.planList[posHold].time).type === "NONE" && this.planList[posHold].order > firstTimeOrder ) {
				arBlank2.push(posHold); // add new position
			}
		}
		
		// move cards into their new order
		this.planMoveSetup();
		for (i=0; i < arPTA.length; i++) {
			this.planPushCard(arPTA[i]);
		}
		for (i=0; i < arBlank1.length; i++) {
			this.planPushCard(arBlank1[i]);
		}
		for (i=0; i < arTime.length; i++) {
			this.planPushCard(arTime[i]);
		}
		for (i=0; i < arBlank2.length; i++) {
			this.planPushCard(arBlank2[i]);
		}
		this.planMoveFinish();

	};

	// INTERNAL setup the HTML rearrange card functions
	// create a division within the planContainer division called planMoveContainer
	this.planMoveSetup = function () {
		// create a division to move cards into
		$('#planContainer').append("<div id='planMoveContainer'></div>");
	};
	
	// INTERNAL cleanup the HTML rearrange card functions
	// removes the planMoveContainer division leaving just the planContainer
	this.planMoveFinish = function () {
		// unwrap division created to move cards into
		// TODO check for container existing under planContainer then do this
		$('#planMoveContainer').children().first().unwrap();
	};
	
	// when given a row number in the planList array, that card is moved to the new division
	// moves HTML cards to the end of the planMoveContainer division
	this.planPushCard = function (pos) {
		$('#planMoveContainer').append( $('#' + this.planList[pos].id) );
	};
	
	// INTERNAL sets the order property of the visible cards and the order they are visually in
	//            also since we are going through the list then set the internal time property of the card
	this.setOrder = function () {
		var cntr = 0;
		var pos = -1;
		var thiscard = this;
		$('#planContainer').children().each(function() {
			pos = thiscard.findCard(this.id); // find the array position based on the id
			if (pos !== -1) {
				thiscard.planList[pos].order = cntr; // set the order that is visually in the list
				cntr += 1;
				thiscard.setTime(pos); // set the internal time
			}
	    });
	};

	// INTERNAL determines if card id has a valid time on it. returns {isTrue: true/false, type: PTA, TIME, NONE}
	// valid times are PTA, 0930, 930, 09:30, 9:30, also with am or pm at the end
	this.isTime = function (strTime) {
		// test for PTA or pta as the first 3 letters
		if (/^([Pp][Tt][Aa])/.test(strTime)) { return {isTrue: true, type: 'PTA'}; }
		// test for 0000 - 2359 with am/pm and a colon
		//if (/^(2[0-3]|[01]?[0-9]):?([0-5][0-9])( *[APap][Mm])?$/.test(strTime)) { return {isTrue: true, type: 'TIME'} }
		// changed hours to accept up to 39hr because of when an incident overlaps over midnight
		if (/^([0123]?[0-9]):?([0-5][0-9])( *[APap][Mm])?$/.test(strTime)) { return {isTrue: true, type: 'TIME'}; }
		// else return false
		return {isTrue: false, type: 'NONE'};
	};
	
	// INTERNAL sets the time property on the card, given the position in the array
	this.setTime = function (arrPos) {
		var strTime = getTXelem(this.planList[arrPos].timeid);
		var timestate = this.isTime(strTime); // check if time value is a time
		if (timestate.isTrue) {
			if (timestate.type === "PTA") {
				this.planList[arrPos].time = "PTA"; // let the time stand as PTA
			} else {
				//var re = "^(2[0-3]|[01]?[0-9]):?([0-5][0-9])( *[APap][Mm])?$";
				var re = "^([0123]?[0-9]):?([0-5][0-9])( *[APap][Mm])?$";
				var rematch = strTime.match(re); // get the groups (0: full text)(1: hr)(2: min)(3: am/pm) of the reg exp
				if (/[Pp][Mm]/.test(rematch[3])) { // check for PM and add 12
					if (parseInt(rematch[1]) < 12) { // check against 2100pm
						rematch[1] = parseInt(rematch[1]) + 12;
						rematch[1] = rematch[1].toString();
					}
				}
				if (rematch[1].length === 1) { rematch[1] = '0' + rematch[1]; } // make hours 2 digits
				this.planList[arrPos].time = rematch[1] + rematch[2]; // put together hr and min in 24hr time
			}
		} else {
			this.planList[arrPos].time = ''; // if not time then set to blank
		}
	};
	
	// INTERNAL fix the times for the situation where the times overlap the end of day ie. 2359, 0001
	this.fix4overlapTime = function () {
		var maxTime = 0;
		var minTime = 9999;
		// find min and max times
		for (var i=0; i < this.planList.length; i++) { // loop through to find cards with times
			if ( this.isTime(this.planList[i].time).type === "TIME" ) {
				if (this.planList[i].time < minTime) { minTime = this.planList[i].time; }
				if (this.planList[i].time > maxTime) { maxTime = this.planList[i].time; }
			}
		}
		// if difference is excessive then assume the times overlap the end of the day, make lower times bigger
		if ((maxTime - minTime) > 1800) {
			for (var k=0; k < this.planList.length; k++) { // loop through to find cards with times
				if ( this.isTime(this.planList[k].time).type === "TIME" ) {
					if (this.planList[k].time < 1200) {
						this.planList[k].time = (parseInt(this.planList[k].time) + 2400).toString(); // add 2400 to times less than 1200 to make them later
					}
				}
			}
		}
	};
	
	// EXTERNAL writes the report for the plan cards
	// writePlan functions are in writepcr.js
	this.write = function () {
		this.setOrder();
		var thishold = this;
		var prevword = cFIRST; // cFIRST, cWORD, cSENT(ence)
		for (var i=0; i < this.planList.length; i++) {
			posHold = this.findCardOrder(i);
			switch (this.planList[posHold].type) {
			case 'plnResponse': 	prevword = writePlanResponse(this.planList[posHold].id, prevword); break;
			case 'plnArrival': 		prevword = writePlanArrival(this.planList[posHold].id, prevword); break;
			case 'plnExam': 		prevword = writePlanExam(this.planList[posHold].id, prevword); break;
			case 'plnVitals': 		prevword = writePlanVitals(this.planList[posHold].id, prevword); break;
			case 'plnGCS': 			prevword = writePlanGCS(this.planList[posHold].id, prevword); break;
			case 'plnO2': 			prevword = writePlanO2(this.planList[posHold].id, prevword); break;
			case 'plnIV': 			prevword = writePlanIV(this.planList[posHold].id, prevword); break;
			case 'plnBSugar': 		prevword = writePlanBSugar(this.planList[posHold].id, prevword); break;
			case 'plnPain': 		prevword = writePlanPain(this.planList[posHold].id, prevword); break;
			case 'plnCNE': 			prevword = writePlanCNE(this.planList[posHold].id, prevword); break;
			case 'plnCPR': 			prevword = writePlanCPR(this.planList[posHold].id, prevword); break;
			case 'plnCap': 			prevword = writePlanCap(this.planList[posHold].id, prevword); break;
			case 'plnDrug': 		prevword = writePlanDrug(this.planList[posHold].id, prevword); break;
			case 'plnOPA': 			prevword = writePlanOPA(this.planList[posHold].id, prevword); break;
			case 'plnETT': 			prevword = writePlanETT(this.planList[posHold].id, prevword); break;
			case 'plnLMA': 			prevword = writePlanLMA(this.planList[posHold].id, prevword); break;
			case 'plnCric': 		prevword = writePlanCric(this.planList[posHold].id, prevword); break;
			case 'plnAck': 			prevword = writePlanAck(this.planList[posHold].id, prevword); break;
			case 'plnSuc': 			prevword = writePlanSuc(this.planList[posHold].id, prevword); break;
			case 'plnOrd': 			prevword = writePlanOrd(this.planList[posHold].id, prevword); break;
			case 'plnEKG': 			prevword = writePlanEKG(this.planList[posHold].id, prevword); break;
			case 'plnFax': 			prevword = writePlanFax(this.planList[posHold].id, prevword); break;
			case 'plnDefib': 		prevword = writePlanDefib(this.planList[posHold].id, prevword); break;
			case 'plnBandage': 		prevword = writePlanBand(this.planList[posHold].id, prevword); break;
			case 'plnSplint': 		prevword = writePlanSplint(this.planList[posHold].id, prevword); break;
			case 'plnExtrication': 	prevword = writePlanExtr(this.planList[posHold].id, prevword); break;
			case 'plnSpinal': 		prevword = writePlanSpinal(this.planList[posHold].id, prevword); break;
			case 'plnCot': 			prevword = writePlanCot(this.planList[posHold].id, prevword); break;
			case 'plnRefusal': 		prevword = writePlanRefusal(this.planList[posHold].id, prevword); break;
			case 'plnAdvised': 		prevword = writePlanAdvised(this.planList[posHold].id, prevword); break;
			case 'plnAmbulance': 	prevword = writePlanAmb(this.planList[posHold].id, prevword); break;
			case 'plnTerm': 		prevword = writePlanTerm(this.planList[posHold].id, prevword); break;
			case 'plnXport': 		prevword = writePlanXport(this.planList[posHold].id, prevword); break;
			case 'plnRadio': 		prevword = writePlanRadio(this.planList[posHold].id, prevword); break;
			case 'plnDest': 		prevword = writePlanDest(this.planList[posHold].id, prevword); break;
			case 'plnXfer': 		prevword = writePlanXfer(this.planList[posHold].id, prevword); break;
			case 'plnEnd': 			prevword = writePlanEnd(this.planList[posHold].id, prevword); break;
			case 'plnOther': 		prevword = writePlanOther(this.planList[posHold].id, prevword); break;
			default: 
				// write custom plan
				if (this.planList[posHold].type.substr(0,7) === 'plncstm') {
					var customData = this.getCustomElement(this.planList[posHold].name);
					if (customData !== null) {
						prevword = writePlanCustom(this.planList[posHold], customData, prevword);
					}
				}
			}
		}
	};
	
	this.getCustomElement = function (name) {
		name = name.toUpperCase();
		for (var i=0; i<this.customElements.length; i++) {
			if (this.customElements[i].title === name) {
				return this.customElements[i];
			}
		}
		return null;
	};
	
} // end of PlanItems class description





//***********************************
//name: addPlan
//var:  e - object, event that sent it here
//		id - string, id of procedure
//		name - string, name of procedure
//return: none
//
//desc: adds procedure cards to the planCard object
//      when the procedure button is clicked
//************************************
function addPlan (e, id, name) {
	planCards.addCard(id,name);
}


//***********************************
//name: planShowNav
//var:  cnt - integer, number of visible procedure cards
//return: none
//
//desc: display the plan card navigation container if there are cards
//************************************
function planShowNav (cnt) {
	if (cnt === 0) {
		$('#planNavigation').hide();
	} else {
		$('#planNavigation').show();
	}
}


//***********************************
//name: toggleCard, hideCard, showCard
//var:  id - string, id of procedure card
//return: none
//
//desc: toggle/hide/show card collapse
//************************************
function toggleCard (id) {
	planSetCollapse(id, 'toggle');
	var first = id.substr(0, id.length-4);
	var last = id.substr(id.length-4, id.length);
	$('#' + first + 'body' + last).slideToggle('fast');
}
function hideCard (id) {
	planSetCollapse(id, 'hide');
	var first = id.substr(0, id.length-4);
	var last = id.substr(id.length-4, id.length);
	$('#' + first + 'body' + last).slideUp('fast');
}
function showCard (id) {
	planSetCollapse(id, 'show');
	var first = id.substr(0, id.length-4);
	var last = id.substr(id.length-4, id.length);
	$('#' + first + 'body' + last).slideDown('fast');
}
//collapse all plan cards
function planCollapseAll () {
	$("#planContainer").children().each(function () {
	    hideCard($(this).attr('id'));
	});
}

//expand all plan cards
function planExpandAll () {
	$("#planContainer").children().each(function () {
	    showCard($(this).attr('id'));
	});
}

//***********************************
//name: deleteCard
//var:  id - string, id of procedure card
//return: none
//
//desc: starts the process of deleting a card from the planCards
//************************************
function deleteCard(id){
	showDeleteDlg(id);
}

//***********************************
//name: showDeleteDlg
//var:  id - string, id of procedure card
//return: none
//
//desc: confirm the deletion with a dialog box
//************************************
function showDeleteDlg(id) {
    $( "#notification" ).dialog({ // create the dialog from nothing
         	  classes: {
         		 //'ui-dialog': 'ui-corner-all deleteDlg',
         		 'ui-dialog-titlebar': 'deleteDlg', // this will class the text only, see below
         		 //'ui-dialog-content' : 'deleteDlg',
         		 //'ui-dialog-buttonpane' : 'deleteDlg'
         	  },
              title: "Deleting Procedure Card",
              width: 400,
              modal: true,
              resizable: false,
              open: function() {
                   var markup = "You are about to delete a procedure card";
                   $(this).html(markup);
              },
              buttons: {
            	  		"No": function() {
                             	$( this ).dialog( "close" ); 
                        },
                        "Yes": function() {
                        	$( this ).dialog( "close" ); 
                         	planCards.removeCard(id); 
                        }
              }
    });
    // set the title bar color
    $('.ui-dialog > .ui-widget-header').css('background', 'red');
}


//***********************************
//name: planSortTime
//var:  none
//return: none
//
//desc: sort cards in time order
//       triggered inside the HTML from the sort button
//************************************
function planSortTime () {
	planCards.sortCards();
}

// move to the top of the plan section
function jumpPlanTop() {
	$("html, body").animate({ scrollTop: $("#divX5").offset().top - 100 }, "fast");
}








/* --------------------------  D I V I S I O N   F U N C T I O N S  ------------------------------------ */
//toggle/hide/show card collapse
function toggleDiv (id) {
	divSetCollapse(id, 'toggle');
	//$('#' + id).toggle('fast');
	$('#' + id).slideToggle('fast');
}
function hideDiv (id) {
	divSetCollapse(id, 'hide');
	//$('#' + id).hide('fast');
	$('#' + id).slideUp('fast');
}
function showDiv (id) {
	divSetCollapse(id, 'show');
	//$('#' + id).show('fast');
	$('#' + id).slideDown('fast');
}

//set collapse indicator - image that shows collapsed or expanded
//this is checked before it is collapsed or expanded because state is not changed when it is set
function planSetCollapse (id, intention) {
	var first = id.substr(0, id.length-4);
	var last = id.substr(id.length-4, id.length);
	var honk = $('#' + first + 'body' + last).is(":visible");
	switch (intention) {
	case 'toggle': 
			if ($('#' + first + 'body' + last).is(":visible")) {
				$('#' + first + 'collapse' + last + ' img').attr('src', '/public/images/plus_blue.svg');
				$('#' + first + 'collapse' + last + ' img').attr('onmouseover', 'this.src="/public/images/plus_blue_circle.svg"');
				$('#' + first + 'collapse' + last + ' img').attr('onmouseout', 'this.src="/public/images/plus_blue.svg"');
			} else {
				$('#' + first + 'collapse' + last + ' img').attr('src', '/public/images/minus_blue.svg');
				$('#' + first + 'collapse' + last + ' img').attr('onmouseover', 'this.src="/public/images/minus_blue_circle.svg"');
				$('#' + first + 'collapse' + last + ' img').attr('onmouseout', 'this.src="/public/images/minus_blue.svg"');
			}
			break;
	case 'hide' :
			$('#' + first + 'collapse' + last + ' img').attr('src', '/public/images/plus_blue.svg');
			$('#' + first + 'collapse' + last + ' img').attr('onmouseover', 'this.src="/public/images/plus_blue_circle.svg"');
			$('#' + first + 'collapse' + last + ' img').attr('onmouseout', 'this.src="/public/images/plus_blue.svg"');
			break;
	case 'show' :
			$('#' + first + 'collapse' + last + ' img').attr('src', '/public/images/minus_blue.svg');
			$('#' + first + 'collapse' + last + ' img').attr('onmouseover', 'this.src="/public/images/minus_blue_circle.svg"');
			$('#' + first + 'collapse' + last + ' img').attr('onmouseout', 'this.src="/public/images/minus_blue.svg');
			break;
	}

}

//set collapse indicator - image that shows collapsed or expanded
//this is checked before it is collapsed or expanded because state is not changed when it is set
function divSetCollapse (id, intention) {
	honk = $('#' + id).is(":visible"); 
	switch (intention) {
	case 'toggle': 
			if ($('#' + id).is(":visible")) {
				$('#' + id + 'collapse' + ' img').attr('src', '/public/images/plus_white.svg');
				$('#' + id + 'collapse' + ' img').attr('onmouseover', 'this.src="/public/images/plus_blue_circle.svg"');
				$('#' + id + 'collapse' + ' img').attr('onmouseout', 'this.src="/public/images/plus_white.svg"');
			} else {
				$('#' + id + 'collapse' + ' img').attr('src', '/public/images/minus_white.svg');
				$('#' + id + 'collapse' + ' img').attr('onmouseover', 'this.src="/public/images/minus_blue_circle.svg"');
				$('#' + id + 'collapse' + ' img').attr('onmouseout', 'this.src="/public/images/minus_white.svg"');
			}
			break;
	case 'hide' :
			$('#' + id + 'collapse' + ' img').attr('src', '/public/images/plus_white.svg');
			$('#' + id + 'collapse' + ' img').attr('onmouseover', 'this.src="/public/images/plus_blue_circle.svg"');
			$('#' + id + 'collapse' + ' img').attr('onmouseout', 'this.src="/public/images/plus_white.svg"');
			break;
	case 'show' :
			$('#' + id + 'collapse' + ' img').attr('src', '/public/images/minus_white.svg');
			$('#' + id + 'collapse' + ' img').attr('onmouseover', 'this.src="/public/images/minus_blue_circle.svg"');
			$('#' + id + 'collapse' + ' img').attr('onmouseout', 'this.src="/public/images/minus_white.svg"');
			break;
	}

}
//collapse all division headers
function divCollapseAll () {
        var divarr = ['divX2','divX3','divX4','divX5','divX6'];
	for (var i=0; i<divarr.length; i++) {
		hideDiv(divarr[i]);
	}
}

//expand all division headers
function divExpandAll () {
        var divarr = ['divX2','divX3','divX4','divX5','divX6'];
	for (var i=0; i<divarr.length; i++) {
		showDiv(divarr[i]);
	}
}
//collapse all assessment headers
function assCollapseAll () {
	var divarr = ['divAC','divHD','divNK','divHS','divSH','divCH','divBS','divAB','divGU','divPV','divLG','divAR','divCT','divBK','divNU','divMS','divTA','divENV','divMOB','divPROP','divOTHR', 'divASSPEC', 'divASSPECX'];
	for (var i=0; i<divarr.length; i++) {
		hideDiv(divarr[i]);
	}
}

//expand all assessment headers
function assExpandAll () {
	var divarr = ['divAC','divHD','divNK','divHS','divSH','divCH','divBS','divAB','divGU','divPV','divLG','divAR','divCT','divBK','divNU','divMS','divTA','divENV','divMOB','divPROP','divOTHR', 'divASSPEC', 'divASSPECX'];
	for (var i=0; i<divarr.length; i++) {
		showDiv(divarr[i]);
	}
}

// scrolls to the top of the page  
function jumpTop() {
	$("html, body").animate({ scrollTop: 0 }, "fast");
}


//if the checkbox "Exam unremarkable" is checked then do not display the other choices
function setcbdiv(secid) {
    if (document.getElementById("cb" + secid) !== null) {
        var cbcheckid = document.getElementById("cb" + secid);
        var divid = document.getElementById("div" + secid + "check");
        if (cbcheckid.checked) {
        	$("#div" + secid + "check").slideUp('fast');
            divid.style.display = "none";  
        }
        else {
        	$("#div" + secid + "check").slideDown('fast');
            divid.style.display = "block";
        }
    }
}


//----------- FUNCTIONS DEALING WITH THE HELP LAYER -------------------------------------------

//display the help layer

function showhelp(e, text, width) {  // get the event, text for the help and the width of the box to display
	width = width || 300;
	// get mouse position
	var mousex = 0;
	var mousey = 0;
	if (!e) { e = window.event; }
    if (e.pageX || e.pageY) {
        mousex = e.pageX;
        mousey = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        mousex = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mousey = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
	var help_area = document.getElementById('help_area');  // div id='help_area' at bottom of page
	help_area.innerHTML = text;
	help_area.style.visibility = 'visible';
	help_area.style.width = width + 'px';
	if (mousex > 700) { mousex -= 200; } // if it's going to be on the right side of the screen then move it back a little
	help_area.style.left = mousex + 3 + 'px';
	help_area.style.top = mousey + 3 + 'px';
}

//hide the help layer on mouseout
function hidehelp() {
	var helparea = document.getElementById('help_area');
	helparea.style.visibility = 'hidden';
}



// calculate weight, if lb is set then calculate kg, if kg is set then calculate lb
// there are 2 places that info can be entered, change in both no matter where it is coming from
function setweight(whichweight, whichone) 
{
	if (whichone === 1) {
	    var kgweight = getTXelem("txtPers_weightkg");
	    var lbweight = getTXelem("txtPers_weightlb");
	} else {
	    var kgweight = getTXelem("weightkg");
	    var lbweight = getTXelem("weightlb");
	}

    switch (whichweight) {
        case "lb":
            if (isnumber(kgweight)) {
                lbweight = kgweight * 2.2;
                $('#txtPers_weightlb').val(rndnumber(lbweight));
                $('#weightlb').val(rndnumber(lbweight));
                $('#txtPers_weightkg').val(kgweight);
                $('#weightkg').val(kgweight);
            }
            break;
        case "kg":
            if (isnumber(lbweight)) {
                kgweight = lbweight / 2.2;
                $('#txtPers_weightkg').val(rndnumber(kgweight));
                $('#weightkg').val(rndnumber(kgweight));
                $('#txtPers_weightlb').val(lbweight);
                $('#weightlb').val(lbweight);
            }
    }
}

function isnumber(number) {
    if ((number >= 0) || (number < 0)) {return true;}
    else {return false;}
}

function rndnumber(number2) {
    if (number2 >= 10) return number2.toFixed(0);
    else return number2.toFixed(1);
}

function toggleMenu() {
    if (window.headerMenu && typeof window.headerMenu.toggle === 'function') {
        window.headerMenu.toggle();
    } else {
        $('#HDR_mainmenu').toggle();
    }
}

// ------------------   P L A N  C A R D  E V E N T   F U N C T I O N S ----------------------------
// in IV/IO show or hide the gtts and drip set depending on choice
function evplnIVgtts(event) {
	var idnum = event.currentTarget.id.slice(-4);
	var str1 = getRBelem('rblPlanIVRate' + idnum);
	if (str1 === 'gtts') {
		$('#idPlanIVgtts' + idnum).show();
	} else {
		$('#idPlanIVgtts' + idnum).hide();
	}
}

// in MEDICATIONS, replace title name with the drug chosen
function evplnDrugName(event,whichone) {
	var idnum = event.currentTarget.id.slice(-4);
	var str1 = '';
	if (whichone === 1) {
		str1 = getDLelem('ddlPlanDrugBasicDrug' + idnum);
		str1 = str1.toUpperCase();
		if (str1 === '') { str1 = 'MEDICATION'; }
		if (notBlank(str1)) {
			$('#plnDrugmaintitle' + idnum).html("<b>" + str1 +"</b>");
			$('#ddlPlanDrugAdvDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#ddlPlanDrugICUDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#txtPlanDrugOther' + idnum).val('');
		}
	}
	if (whichone === 2) {
		str1 = getDLelem('ddlPlanDrugAdvDrug' + idnum);
		str1 = str1.toUpperCase();
		if (str1 === '') { str1 = 'MEDICATION'; }
		if (notBlank(str1)) {
			$('#plnDrugmaintitle' + idnum).html("<b>" + str1 +"</b>");
			$('#ddlPlanDrugBasicDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#ddlPlanDrugICUDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#txtPlanDrugOther' + idnum).val('');
		}
	}
	if (whichone === 3) {
		str1 = getDLelem('ddlPlanDrugICUDrug' + idnum);
		str1 = str1.toUpperCase();
		if (str1 === '') { str1 = 'MEDICATION'; }
		if (notBlank(str1)) {
			$('#plnDrugmaintitle' + idnum).html("<b>" + str1 +"</b>");
			$('#ddlPlanDrugAdvDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#ddlPlanDrugBasicDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#txtPlanDrugOther' + idnum).val('');
		}
	}
	if (whichone === 4) {
		str1 = getTXelem('txtPlanDrugOther' + idnum);
		str1 = str1.toUpperCase();
		if (str1 === '') { str1 = 'MEDICATION'; }
		if (notBlank(str1)) {
			$('#plnDrugmaintitle' + idnum).html("<b>" + str1.slice(0,30) +"</b>");
			$('#ddlPlanDrugAdvDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#ddlPlanDrugBasicDrug' + idnum + ' option:eq(0)').prop('selected', true);
			$('#ddlPlanDrugICUDrug' + idnum + ' option:eq(0)').prop('selected', true);
		}
	}
}

// in AIRWAY OPA/NPA, checks the OPA or NPA option if there text are filled out
function evplnOPA(event, whichone) {
	var idnum = event.currentTarget.id.slice(-4);
	if (whichone === 1) {
		$('#rbPlanAirwayOPA' + idnum).prop('checked', true);
	}if (whichone === 2) {
		$('#rbPlanAirwayNPA' + idnum).prop('checked', true);
	}
}

// in AIRWAY LARYNGEAL, changes the title based on the type used 
function evplnLMAtype(event) {
	var idnum = event.currentTarget.id.slice(-4);
	var str1 = '';
	str1 = getTXelem('txtPlanLMAdevice' + idnum);
	str1 = str1.toUpperCase();
	if (str1 === '') { str1 = 'AIRWAY LARYNGEAL'; }
	$('#plnLMAmaintitle' + idnum).html("<b>" + str1.slice(0,30) +"</b>");
}

// in DEFIB/PACING, change the title based on the action
function evplnDefib(event) {
	var idnum = event.currentTarget.id.slice(-4);
	var str1 = '';
	str1 = getRBelem('rblPlanDefibType' + idnum);
	str1 = str1.toUpperCase();
	if (str1 === '') { str1 = 'DEFIB / PACING'; }
	$('#plnDefibmaintitle' + idnum).html("<b>" + str1 +"</b>");
}

//in OTHER, change the title based on the procedure name
function evplnOther(event) {
	var idnum = event.currentTarget.id.slice(-4);
	var str1 = '';
	str1 = getTXelem('txtPlanOtherName' + idnum);
	str1 = str1.toUpperCase();
	if (str1 === '') { str1 = 'OTHER'; }
	$('#plnOthermaintitle' + idnum).html("<b>" + str1.slice(0,30) +"</b>");
}

//in Cranial Nerve exam, hide table if grossly intact is checked
function evplnCNE(event) {
	var idnum = event.currentTarget.id.slice(-4);
	var str1 = getCBelem('cbPlanCNEintact' + idnum);
	if (str1 === '') { 
		$('#tblPlanCNE' + idnum).show();
	} else {
		$('#tblPlanCNE' + idnum).hide();
	}
}

//in INCIDENT, when RESPONSE is chosen by drop down, clear radio buttons
function evincddlResponse () {
	var choose = getDLelem('ddlInc_ResponseCode');
	if (choose !== '') {
		$('input[name="rbInc_response"]').prop('checked', false);
	}
}
// in INCIDENT, when TRANSPORT is chosen by drop down, clear radio buttons
function evincddlTransport () {
	var choose = getDLelem('ddlInc_TransportCode');
	if (choose !== '') {
		$('input[name="rbInc_transport"]').prop('checked', false);
	}
}

// report time
function endTime() {
	var now = new Date();
	var month = now.getMonth()+1;
	var date = now.getDate();
	//if (date<10) { date = '0' + date; }
	var year = now.getFullYear();
	var hours = now.getHours();
	if (hours<10) { hours = '0' + hours; }
	var min = now.getMinutes();
	if (min<10) { min = '0' + min; }
	var nowstr = month + '/' + date + '/' + year + ' ' + hours + ':' + min;
	$('#endTime').val(nowstr);
}

// GCS
// adds up gcs score when a value changes
function evplnGCS(event) {
	var idnum = event.currentTarget.id.slice(-4);
	var score = sum_GCS(idnum);
	if (score > 0) {
		$('#txtPlanGCStotal' + idnum).html(' = ' + score);
	} else {
		$('#txtPlanGCStotal' + idnum).html('');
	}
}
// changes the gcs type shown and adds total
function evplnGCStype(event) {
	var idnum = event.currentTarget.name.slice(-4);
	var type = getRBelem('rbPlanGCStype' + idnum);
	if (type === 'adult') {
		$('#planGCS_table_adult' + idnum).show();
		$('#planGCS_table_infant' + idnum).hide();
	} else {
		$('#planGCS_table_infant' + idnum).show();
		$('#planGCS_table_adult' + idnum).hide();
	}
	var score = sum_GCS(idnum);
	if (score > 0) {
		$('#txtPlanGCStotal' + idnum).html(' = ' + score);
	} else {
		$('#txtPlanGCStotal' + idnum).html('');
	}
}
function sum_GCS(idnum) {
	var score = 0;
	var type = getRBelem('rbPlanGCStype' + idnum);
	if (type === 'adult') {
		score += get_gcs_value('ddlPlanGCSeye_adult' + idnum);
		score += get_gcs_value('ddlPlanGCSverbal_adult' + idnum);
		score += get_gcs_value('ddlPlanGCSmotor_adult' + idnum);
	} else {
		score += get_gcs_value('ddlPlanGCSeye_infant' + idnum);
		score += get_gcs_value('ddlPlanGCSverbal_infant' + idnum);
		score += get_gcs_value('ddlPlanGCSmotor_infant' + idnum);
	}
	return score;
}
function get_gcs_value(id) {
	var hs = $("#" + id + " option:selected" ).data('value');
	if (hs === undefined) {
		hs = "0";
	}
	return parseInt(hs);
}

// *******************  L O C A T I O N  *************************************************************

function getGPS_from_address () {
	address = getTXelem('txtInc_loc_address');
	city = getTXelem('txtInc_loc_city');
	state = getTXelem('txtInc_loc_state');
	zip = getTXelem('txtInc_loc_zip');
	fulladdress = address + ', ' + city + ', ' + state + ' ' + zip;
	
	$.ajax({
		type: 'GET',
		url: 'location/getGPS',
		data: {address: fulladdress},
		datatype: 'json',
		error: function (results) {},
		success: function (results) {
			gps_results = JSON.parse(results);
			if (gps_results['latitude'] !== null) {
				$('#txtInc_loc_gpslat').val(gps_results['latitude']);
				$('#txtInc_loc_gpslong').val(gps_results['longitude']);
				$('#linkInc_loc_gps').html("<a href='https://www.google.com/maps/search/?api=1&query=" + gps_results['latitude'] + ',' + gps_results['longitude'] + "' target='_blank'>maps.google.com" + "</a>");
				getW3W_from_gps(gps_results['latitude'], gps_results['longitude']);
			}
		}
	});
}
function getW3W_from_gps (latitude, longitude) {
	$.ajax({
		type: 'GET',
		url: 'location/getW3W',
		data: {latitude: latitude, longitude: longitude},
		datatype: 'json',
		error: function (results) {},
		success: function (results) {
			w3w_results = JSON.parse(results);
			$('#txtInc_loc_w3w').val(w3w_results);
			$('#linkInc_loc_w3w').html("<a href='https://map.what3words.com/" + w3w_results + "' target='_blank'>what3words.com" + "</a>");
		}
	});
}
function getW3W_suggestion (address3) {
	$.ajax({
		type: 'POST',
		url: '/location/getW3W',
		data: {type: 'suggest', address3: address3},
		datatype: 'json',
		error: function (results) {},
		success: function (results) {
			var w3w_results = JSON.parse(results);
			if (w3w_results !== null) {
				W3W_show_suggestion(w3w_results);
			}
		}
	});
}
function getW3W_gps (address3) {
	if (address3 !== '') {
		$.ajax({
			type: 'POST',
			url: 'location/getW3W',
			data: {type: 'togps', address3: address3},
			datatype: 'json',
			error: function (results) {},
			success: function (results) {
				var w3w_results = JSON.parse(results);
				if (w3w_results !== null) {
					W3W_show_gps(w3w_results);
				}
			}
		});
	}
}
function getW3W_from_gps(latitude, longitude) {
	if (latitude !== '' && longitude !== '') {
		$.ajax({
			type: 'POST',
			url: 'location/getW3W',
			data: {type: 'fromgps', latitude: latitude, longitude: longitude},
			datatype: 'json',
			error: function (results) {},
			success: function (results) {
				var w3w_results = JSON.parse(results);
				if (w3w_results !== null) {
					W3W_show_w3w(w3w_results);
				}
			}
		});
	}
}
function w3w_submit(address3) {
	var address3_split = address3.split(".");
	if (address3_split.length === 3) {
		return true;
	} else {
		return false;
	}
}
function W3W_show_suggestion (data) {
	var html = '';
	for (var i=0; i<data.length; i++) {
		html += "<div onclick='w3w_show_this(\"" + data[i].word3 + "\")'><span style='font-size: 18px;'>/// " + data[i].word3 + "</span><br><span style='font-size: 12px;'>" + data[i].city + "</span></div>";
	}
	$('#w3wInc_suggestions').html(html);
	$('#w3wInc_suggestions').show();
}
function w3w_show_this(address3) {
	$('#txtInc_loc_w3w').val(address3);
}
function W3W_show_gps(data) {
	var lat = getTXelem('txtInc_loc_gpslat');
	var long = getTXelem('txtInc_loc_gpslong');
	if (lat === '' && long === '') {
		$('#txtInc_loc_gpslat').val(data.lat);
		$('#txtInc_loc_gpslong').val(data.long);
		setGoogle_maps_link();
	}
}
function W3W_show_w3w(data) {
	var w3w = getTXelem('txtInc_loc_w3w');
	if (w3w === '') {
		$('#txtInc_loc_w3w').val(data.words);
		setW3W_maps_link();
	}
}
function setGoogle_maps_link() {
	var lat = getTXelem('txtInc_loc_gpslat');
	var long = getTXelem('txtInc_loc_gpslong');
	if (lat !== '' && long !== '') {
		var html = "<a href='https://www.google.com/maps/search/?api=1&query=" + lat + ',' + long + "' target='_blank'>Google Maps</a>";
	} else {
		var html = "<a href='https://maps.google.com' target='_blank'>Google Maps</a>";
	}
	$('#gpsInc_maplink').html(html);
}
function setW3W_maps_link() {
	var w3w = getTXelem('txtInc_loc_w3w');
	if (w3w !== '') {
		var html = "<a href='https://map.what3words.com/" + w3w + "' target='_blank'>What3Words Map</a>";
	}else {
		var html = "<a href='https://map.what3words.com' target='_blank'>What3Words Map</a>";
	}
	$('#w3wInc_maplink').html(html);
}

// *************** ASSESSMENT SPECIFIC *******************************************************************
function show_asspec() {
	var counter = 0;
	$('#divASSPEC input[type=checkbox]').each(function () {
		if (this.checked) {
			counter += 1;
			switch (this.id) {
			case 'cbASSPEC_CHESTPAIN': 	$('#divASSPEC_CHESTPAIN').show(); break;
			case 'cbASSPEC_HTN': 		$('#divASSPEC_HTN').show(); break;
			case 'cbASSPEC_HYPERG': 	$('#divASSPEC_HYPERG').show(); break;
			case 'cbASSPEC_HYPOG': 		$('#divASSPEC_HYPOG').show(); break;
			case 'cbASSPEC_ALT': 		$('#divASSPEC_ALT').show(); break;
			case 'cbASSPEC_BITE': 		$('#divASSPEC_BITE').show(); break;
			case 'cbASSPEC_BURN': 		$('#divASSPEC_BURN').show(); break;
			case 'cbASSPEC_CO': 		$('#divASSPEC_CO').show(); break;
			case 'cbASSPEC_HYPOT': 		$('#divASSPEC_HYPOT').show(); break;
			case 'cbASSPEC_HAZMAT': 	$('#divASSPEC_HAZMAT').show(); break;
			case 'cbASSPEC_HYPERT': 	$('#divASSPEC_HYPERT').show(); break;
			case 'cbASSPEC_ABPN': 		$('#divASSPEC_ABPN').show(); break;
			case 'cbASSPEC_DEHYD': 		$('#divASSPEC_DEHYD').show(); break;
			case 'cbASSPEC_GI': 		$('#divASSPEC_GI').show(); break;
			case 'cbASSPEC_FLU': 		$('#divASSPEC_FLU').show(); break;
			case 'cbASSPEC_AMS': 		$('#divASSPEC_AMS').show(); break;
			case 'cbASSPEC_CVA': 		$('#divASSPEC_CVA').show(); break;
			case 'cbASSPEC_SYNC': 		$('#divASSPEC_SYNC').show(); break;
			case 'cbASSPEC_SZ': 		$('#divASSPEC_SZ').show(); break;
			case 'cbASSPEC_OB': 		$('#divASSPEC_OB').show(); break;
			case 'cbASSPEC_BIRTH': 		$('#divASSPEC_BIRTH').show(); break;
			case 'cbASSPEC_VAG': 		$('#divASSPEC_VAG').show(); break;
			case 'cbASSPEC_NPAIN': 		$('#divASSPEC_NPAIN').show(); break;
			case 'cbASSPEC_PSYCH': 		$('#divASSPEC_PSYCH').show(); break;
			case 'cbASSPEC_APNEA': 		$('#divASSPEC_APNEA').show(); break;
			case 'cbASSPEC_RESP': 		$('#divASSPEC_RESP').show(); break;
			case 'cbASSPEC_SHOCK': 		$('#divASSPEC_SHOCK').show(); break;
			case 'cbASSPEC_OD': 		$('#divASSPEC_OD').show(); break;
			case 'cbASSPEC_MVC': 		$('#divASSPEC_MVC').show(); break;
			case 'cbASSPEC_TRAUMA': 	$('#divASSPEC_TRAUMA').show(); break;
			case 'cbASSPEC_NOSE': 		$('#divASSPEC_NOSE').show(); break;
			case 'cbASSPEC_FEVER': 		$('#divASSPEC_FEVER').show(); break;
			case 'cbASSPEC_SEX': 		$('#divASSPEC_SEX').show(); break;
			case 'cbASSPEC_ALLERGIC': 	$('#divASSPEC_ALLERGIC').show(); break;
			}
		} else {
			switch (this.id) {
			case 'cbASSPEC_CHESTPAIN': 	$('#divASSPEC_CHESTPAIN').hide(); break;
			case 'cbASSPEC_HTN': 		$('#divASSPEC_HTN').hide(); break;
			case 'cbASSPEC_HYPERG': 	$('#divASSPEC_HYPERG').hide(); break;
			case 'cbASSPEC_HYPOG': 		$('#divASSPEC_HYPOG').hide(); break;
			case 'cbASSPEC_ALT': 		$('#divASSPEC_ALT').hide(); break;
			case 'cbASSPEC_BITE': 		$('#divASSPEC_BITE').hide(); break;
			case 'cbASSPEC_BURN': 		$('#divASSPEC_BURN').hide(); break;
			case 'cbASSPEC_CO': 		$('#divASSPEC_CO').hide(); break;
			case 'cbASSPEC_HYPOT': 		$('#divASSPEC_HYPOT').hide(); break;
			case 'cbASSPEC_HAZMAT': 	$('#divASSPEC_HAZMAT').hide(); break;
			case 'cbASSPEC_HYPERT': 	$('#divASSPEC_HYPERT').hide(); break;
			case 'cbASSPEC_ABPN': 		$('#divASSPEC_ABPN').hide(); break;
			case 'cbASSPEC_DEHYD': 		$('#divASSPEC_DEHYD').hide(); break;
			case 'cbASSPEC_GI': 		$('#divASSPEC_GI').hide(); break;
			case 'cbASSPEC_FLU': 		$('#divASSPEC_FLU').hide(); break;
			case 'cbASSPEC_AMS': 		$('#divASSPEC_AMS').hide(); break;
			case 'cbASSPEC_CVA': 		$('#divASSPEC_CVA').hide(); break;
			case 'cbASSPEC_SYNC': 		$('#divASSPEC_SYNC').hide(); break;
			case 'cbASSPEC_SZ': 		$('#divASSPEC_SZ').hide(); break;
			case 'cbASSPEC_OB': 		$('#divASSPEC_OB').hide(); break;
			case 'cbASSPEC_BIRTH': 		$('#divASSPEC_BIRTH').hide(); break;
			case 'cbASSPEC_VAG': 		$('#divASSPEC_VAG').hide(); break;
			case 'cbASSPEC_NPAIN': 		$('#divASSPEC_NPAIN').hide(); break;
			case 'cbASSPEC_PSYCH': 		$('#divASSPEC_PSYCH').hide(); break;
			case 'cbASSPEC_APNEA': 		$('#divASSPEC_APNEA').hide(); break;
			case 'cbASSPEC_RESP': 		$('#divASSPEC_RESP').hide(); break;
			case 'cbASSPEC_SHOCK': 		$('#divASSPEC_SHOCK').hide(); break;
			case 'cbASSPEC_OD': 		$('#divASSPEC_OD').hide(); break;
			case 'cbASSPEC_MVC': 		$('#divASSPEC_MVC').hide(); break;
			case 'cbASSPEC_TRAUMA': 	$('#divASSPEC_TRAUMA').hide(); break;
			case 'cbASSPEC_NOSE': 		$('#divASSPEC_NOSE').hide(); break;
			case 'cbASSPEC_FEVER': 		$('#divASSPEC_FEVER').hide(); break;
			case 'cbASSPEC_SEX': 		$('#divASSPEC_SEX').hide(); break;
			case 'cbASSPEC_ALLERGIC': 	$('#divASSPEC_ALLERGIC').hide(); break;
			}
		}
		if (counter > 0) {
			showDiv('divASSPECX');
		}
	});
}

// APGAR SCORES
function apgar_score1(){
	var score1 = 0;
	score1 += get_apgar_value('ASSPEC_BIRTH_1activity');
	score1 += get_apgar_value('ASSPEC_BIRTH_1pulse');
	score1 += get_apgar_value('ASSPEC_BIRTH_1grimace');
	score1 += get_apgar_value('ASSPEC_BIRTH_1appearance');
	score1 += get_apgar_value('ASSPEC_BIRTH_1respiration');
	return score1;
}
function apgar_score5(){
	var score5 = 0;
	score5 += get_apgar_value('ASSPEC_BIRTH_5activity');
	score5 += get_apgar_value('ASSPEC_BIRTH_5pulse');
	score5 += get_apgar_value('ASSPEC_BIRTH_5grimace');
	score5 += get_apgar_value('ASSPEC_BIRTH_5appearance');
	score5 += get_apgar_value('ASSPEC_BIRTH_5respiration');
	return score5;
}
function get_apgar_value(id) {
	var hs = $("input[name='" + id + "']:checked").data('value');
	if (hs === undefined) {
		hs = "0";
	}
	return parseInt(hs);
}

function copy_to_clipboard() {
	var copyTextid = document.getElementById("txtReport");
	copyTextid.select();
	try {
	    var successful = document.execCommand('copy');
	} catch (err) {
		alert('Sorry, unable to copy your report (your browser does not support copying)');
	}
}


// *******************  G O O G L E   A N A L Y T I C S  **************************************************

//tracks usage, sends non-repeating events to google analytics
function setUsage(section, elem) {
	if (! gUsage.hasOwnProperty(section)) { // check if section exists, if not then add it
		gUsage[section]={};
	}
	if ( ! gUsage[section].hasOwnProperty(elem)) { // check if elem exists, if not then add it and trigger gtag event
		gUsage[section][elem] = true;
		gtag('event', 'Write Report', {
			  'event_category' : section,
			  'event_label' : elem
			});
	}
}