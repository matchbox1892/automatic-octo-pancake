//Global 
window.PCReport = "";
window.cFIRST = 'first';
window.cWORD = 'word';
window.cSENT = 'sent';
window.cRETURN = '\n';
window.cCOMMA = ', ';
window.CHARTreport = '';
window.CHART_section = ''; // PRE, C, H, A, R, T, E
window.CHART_PRE = '';
window.CHART_C = '';
window.CHART_H = '';
window.CHART_A = '';
window.CHART_R = '';
window.CHART_T = '';
window.CHART_E = '';
window.CHART_savepos = 0;
window.CHART_R_savepos = 0;
window.CHART_T_savepos = 0;
window.CHART_R_prevword = cFIRST;
window.CHART_T_prevword = cFIRST;

// CHART
//Dispatch Information section
//C: Dispatch Information, Age/Weight/Sex, Chief complaint from the Subjective Information section
//H: Subjective description, OPQRST, Admits/Denies, PMH, Rx, OTC meds, Allergies from the Subjective Information section
//A: General Impression, All exams from Objective Information, Assessment - diagnosis
//R: Plan section, except below
//T: TO COT, REFUSAL, in ambulance, transport, radio report, destination, transfer care, end of contact

function writepcr () {
	PCReport = "";
	CHARTreport = '';
	CHART_PRE = '';
	CHART_C = '';
	CHART_H = '';
	CHART_A = '';
	CHART_R = '';
	CHART_T = '';
	CHART_E = '';
	CHART_R_prevword = cFIRST;
	CHART_T_prevword = cFIRST;
	gUsage = {};
	writeIncident();
	writePatient();
	writeInsurance();
	writeDispatch();
	writeSubj();
	writeObj();
	writeAss();
	writePlan();
	writeEnding();
	writeCHART();
	
	// choose which report to show
	if (getCBelem('chart_button') === 'CHART') {
		$('#txtReport').val(CHARTreport);
		setUsage('Report', 'CHART');
		setChartSelection(true);
	} else {
		$('#txtReport').val(PCReport);
		setUsage('Report', 'Report');
		setChartSelection(false);
	}
	setReportHeight();
	
	//save_pcr_data ('Last Report');
}

function writeIncident() {
	var str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, prevTxt, prevTxt2, savedRptPos;
	
	setCHART('PRE');
	
	// Date, Incident #
	prevTxt = false;
	prevTxt2 = false;
	str1 = getTXelem('txtInc_date');
	str2 = getTXelem('txtInc_incident_num');

	if (notBlank(str1)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Date: ' + str1);
		prevTxt = true;
	}
	if (notBlank(str2)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Incident #: ' + str2);
		prevTxt = true;
	}
	if (prevTxt) {
		addReturn();
		addReturn();
	}
	
	// Location
	//prevTxt = false;
	prevTxt2 = false;
	str1 = getTXelem('txtInc_loc_address');
	str2 = getTXelem('txtInc_loc_room');
	str3 = getTXelem('txtInc_loc_city');
	str4 = getTXelem('txtInc_loc_state');
	str5 = getTXelem('txtInc_loc_zip');
	str6 = getTXelem('txtInc_loc_gpslat');
	str7 = getTXelem('txtInc_loc_gpslong');
	str8 = getTXelem('txtInc_loc_w3w');
	
	if (notBlank(str1) || notBlank(str1) || notBlank(str1) || notBlank(str1) || notBlank(str1) || notBlank(str1) || notBlank(str1) || notBlank(str1)) { prevTxt = true; }
	
	// address
	if (notBlank(str1)) {
		if (prevTxt2) { addComma(); }
		addTo(str1);
		prevTxt2 = true;
	}
	// room
	if (notBlank(str2)) {
		if (prevTxt2) { addComma(); }
		addTo(str2);
		prevTxt2 = true;
	}
	// city
	if (notBlank(str3)) {
		if (prevTxt2) { addComma(); }
		addTo(str3);
		prevTxt2 = true;
	}
	// state
	if (notBlank(str4)) {
		if (prevTxt2) { addComma(); }
		addTo(str4);
		prevTxt2 = true;
	}
	// zip
	if (notBlank(str5)) {
		if (prevTxt2) { addSpace(); }
		addTo(str5);
		prevTxt2 = true;
	}
	// gps
	if (notBlank(str6) || notBlank(str7)) {
		if (prevTxt2) { addComma(); }
		addTo('GPS: ');
		if (notBlank(str6)) {
			addTo(str6);
			if (notBlank(str7)) {
				addTo(', ' + str7);
			}
		} else {
			if (notBlank(str7)) {
				addTo(str7);
			}
		}
		prevTxt2 = true;
	}
	// w3w
	if (notBlank(str8)) {
		if (prevTxt2) { addComma(); }
		addTo('W3W: /// ' + str8);
		prevTxt2 = true;
	}
	
	if (prevTxt2) {
		addReturn();
		addReturn();
	}

	// Times
	prevTxt = false;
	prevTxt2 = false;
	str1 = getTXelem('txtInc_time_incoming');
	str2 = getTXelem('txtInc_time_dispatched');
	str3 = getTXelem('txtInc_time_responding');
	str4 = getTXelem('txtInc_time_arrival');
	str5 = getTXelem('txtInc_time_contact');
	str6 = getTXelem('txtInc_time_transport');
	str7 = getTXelem('txtInc_time_destination');
	str8 = getTXelem('txtInc_time_bis');
	str9 = getTXelem('txtInc_time_qtrs');
	str10 = getTXelem('txtInc_time_cancelled');
	str11 = getTXelem('txtInc_time_other');
	str12 = getTXelem('txtInc_time_otherdesc');

	// incoming
	if (notBlank(str1)) {
		addTo(str1 + ': Incoming call');
		addReturn();
		prevTxt = true;
	}
	// dispatched
	if (notBlank(str2)) {
		addTo(str2 + ': Dispatched');
		addReturn();
		prevTxt = true;
	}
	// responding
	if (notBlank(str3)) {
		addTo(str3 + ': Responding');
		addReturn();
		prevTxt = true;
	}
	// arrival
	if (notBlank(str4)) {
		addTo(str4 + ': Arrival');
		addReturn();
		prevTxt = true;
	}
	// contact
	if (notBlank(str5)) {
		addTo(str5 + ': Pt contact');
		addReturn();
		prevTxt = true;
	}
	// transport
	if (notBlank(str6)) {
		addTo(str6 + ': Transport/Left Scene');
		addReturn();
		prevTxt = true;
	}
	// destination
	if (notBlank(str7)) {
		addTo(str7 + ': Destination');
		addReturn();
		prevTxt = true;
	}
	// bis
	if (notBlank(str8)) {
		addTo(str8 + ': BIS');
		addReturn();
		prevTxt = true;
	}
	// qtrs
	if (notBlank(str9)) {
		addTo(str9 + ': At Quarters');
		addReturn();
		prevTxt = true;
	}
	// cancelled
	if (notBlank(str10)) {
		addTo(str10 + ': Cancelled');
		addReturn();
		prevTxt = true;
	}
	// other
	if (notBlank(str11) || notBlank(str12)) {
		if (notBlank(str11)) {
			addTo(str11);
			if (!notBlank(str12)) {
				addTo(': Other');
			}
		}
		if (notBlank(str12)) {
			addTo(': ' + str12);
		}
		addReturn();
		prevTxt = true;
	}

	if (prevTxt) { addReturn(); }
	

	// Apparatus, Response
	prevTxt = false;
	prevTxt2 = false;
	str1 = initCap(getTXelem('txtInc_apparatus'));
	str2 = getRBelem('rbShift');
	str3 = getTXelem('txtShift');
	str4 = getRBelem('rbInc_response');
	str5 = getDLelem('ddlInc_ResponseCode');
	str6 = getRBelem('rbInc_transport');
	str7 = getDLelem('ddlInc_TransportCode');
	str8 = getDLelem('ddlInc_disposition');
	str9 = getTXelem('txtInc_disposition_other');
	
	// apparatus
	if (notBlank(str1)) {
		addTo(str1);
		prevTxt = true;
	}
	// shift
	if (notBlank(str2)) {
		addSpace(prevTxt);
		addTo(str2 + ' shift');
		prevTxt = true;
	}
	// other shift
	if (notBlank(str3)) {
		addSpace(prevTxt);
		addTo(str3 + ' shift');
		prevTxt = true;
	}
	// response 
	if (notBlank(str4) || notBlank(str5)) {
		if (prevTxt) { addComma(); }
		addTo('Response: ');
		if (notBlank(str4)) { addTo(initCap(str4)); }
		if (notBlank(str4) && notBlank(str5)) {
			addComma();
		}
		if (notBlank(str5)) { addTo(initCap(str5)); }
		prevTxt = true;
	}
	// tranport 
	if (notBlank(str6) || notBlank(str7)) {
		if (prevTxt) { addComma(); }
		addTo('Transport: ');
		if (notBlank(str6)) { addTo(initCap(str6)); }
		if (notBlank(str6) && notBlank(str7)) {
			addComma();
		}
		if (notBlank(str7)) { addTo(initCap(str7)); }
		prevTxt = true;
	}
	// disposition 
	if (notBlank(str8) || notBlank(str9)) {
		if (prevTxt) { addReturn(); }
		addTo('Disposition: ');
		if (str8 === 'Other') {
			if (notBlank(str9)) {
				addTo(initCap(str9));
			} else {
				addTo('Other');
			}
		} else {
			addTo(str8);
		}
		prevTxt = true;
	}

	if (prevTxt) { addReturn(); addReturn(); }
	

	// Personnel
	prevTxt = false;
	prevTxt2 = false;
	
	savedRptPos = savePos();
	// loop through each input field of personnel
	$('#tblInc_personnel tr input').each(function() {
		var idtxt = $(this).attr('id');
		str1 = getTXelem(idtxt);
		// name
		if (idtxt.slice(-4) === 'name') {
			if (notBlank(str1)) {
				if (prevTxt) { addSemi(); }
				addTo(str1);
				prevTxt = true;
				prevTxt2 = true;
			}
		}
		// role
		if (idtxt.slice(-4) === 'role') {
			if (notBlank(str1)) {
				if (prevTxt2) { addComma(); }
				if (prevTxt && !prevTxt2) { addSemi(); }
				addTo(initCap(str1));
				prevTxt = true;
			}
			prevTxt2 = false;
		}
	});
	
	if (prevTxt) { 
		insertPos("Personnel: ", savedRptPos);
		addReturn();
		addReturn();
	}
	
	// Mileage
	prevTxt = false;
	prevTxt2 = false;
	str1 = getTXelem('txtInc_miles_responding');
	str2 = getTXelem('txtInc_miles_scene');
	str3 = getTXelem('txtInc_miles_destination');
	str4 = getTXelem('txtInc_miles_other');
	str5 = getTXelem('txtInc_miles_otherdesc');

	savedRptPos = savePos();
	// Responding
	if (notBlank(str1)) {
		//addReturn();
		addTo('At Responding: ' + str1);
		prevTxt = true;
	}
	// Scene
	if (notBlank(str2)) {
		addComma();
		addTo('At Scene: ' + str2);
		prevTxt = true;
	}
	// Destination
	if (notBlank(str3)) {
		addComma();
		addTo('At Destination: ' + str3);
		prevTxt = true;
	}
	// Other
	if (notBlank(str4) || notBlank(str5)) {
		addComma();
		if (notBlank(str4)) {
			if (notBlank(str5)) {
				addTo(initCap(str5) + ': ');
			} else {
				addTo('Other: ');
			}
			addTo(str4);
			prevTxt = true;
		}
	}
	if (prevTxt) { 
		insertPos("Mileage: ", savedRptPos);
		addReturn();
		addReturn();
	}
	
	setUsage('Incident', 'Incident');
}
function writePatient() {
	var str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, prevTxt, prevTxt2, savedRptPos;
	
	setCHART('PRE');
	
	savedRptPos = savePos();
	// Date, Incident #
	prevTxt = false;
	prevTxt2 = false;
	str1 = getTXelem('txtPers_firstname');
	str2 = getTXelem('txtPers_middlename');
	str3 = getTXelem('txtPers_lastname');
	str4 = getTXelem('txtPers_phone1');
	str5 = getTXelem('txtPers_phone2');
	str6 = getTXelem('txtPers_bd_month');
	str7 = getTXelem('txtPers_bd_day');
	str8 = getTXelem('txtPers_bd_year');

	// lastname
	if (notBlank(str3)) {
		if (prevTxt) {
			addComma();
		}
		addTo(str3);
		prevTxt = true;
	}
	// firstname
	if (notBlank(str1)) {
		if (prevTxt) {
			addComma();
		}
		addTo(str1);
		prevTxt = true;
	} 
	// middle name
	if (notBlank(str2)) {
		if (prevTxt) {
			addSpace();
		}
		addTo(str2);
		prevTxt = true;
	}
	// birthdate month
	if (notBlank(str6)) {
		if (prevTxt) {
			addReturn();
		}
		addTo(str6);
		prevTxt2 = true;
		prevTxt = true;
	}
	// birthdate day
	if (notBlank(str7)) {
		if (prevTxt2) {
			addTo('/');
		} else {
			addReturn();
		}
		addTo(str7);
		prevTxt2 = true;
		prevTxt = true;
	}
	// birthdate year
	if (notBlank(str8)) {
		if (prevTxt2) {
			addTo('/');
		} else {
			addReturn();
		}
		addTo(str8);
		prevTxt2 = false;
		prevTxt = true;
	}
	// phone 1
	if (notBlank(str4)) {
		if (prevTxt) {
			addReturn();
		}
		addTo(str4);
		prevTxt2 = true;
		prevTxt = true;
	}
	// phone2
	if (notBlank(str5)) {
		if (!prevTxt2) {
			addReturn();
		} else {
			addComma();
		}
		addTo(str5);
		prevTxt = true;
	}

	str1 = getTXelem('txtPers_loc_address');
	str2 = getTXelem('txtPers_loc_room');
	str3 = getTXelem('txtPers_loc_city');
	str4 = getTXelem('txtPers_loc_state');
	str5 = getTXelem('txtPers_loc_zip');

	// address
	if (notBlank(str1)) {
		if (prevTxt) { addReturn(); }
		addTo(str1);
		prevTxt = true;
	}
	// room
	if (notBlank(str2)) {
		if (prevTxt) { addComma(); }
		addTo(str2);
		prevTxt = true;
	}
	// city
	if (notBlank(str3)) {
		if (prevTxt) { addComma(); }
		addTo(str3);
		prevTxt = true;
	}
	// state
	if (notBlank(str4)) {
		if (prevTxt) { addComma(); }
		addTo(str4);
		prevTxt = true;
	}
	// zip
	if (notBlank(str5)) {
		if (prevTxt) { addSpace(); }
		addTo(str5);
		prevTxt = true;
	}
	
	if (prevTxt) {
		insertPos("Patient: " + cRETURN, savedRptPos);
		addReturn();
		addReturn();
	}
	
}
function writeInsurance() {
	var str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12, prevTxt, prevTxt2, savedRptPos;
	
	setCHART('PRE');
	
	savedRptPos = savePos();
	// 
	prevTxt = false;
	prevTxt2 = false;
	str1 = getTXelem('txtIns_company');
	str2 = getDLelem('ddlIns_type');
	str3 = getTXelem('txtIns_policy');
	str4 = getTXelem('txtIns_group');
	str5 = getTXelem('txtIns_social');
	str6 = getTXelem('txtIns_insured');
	str7 = getDLelem('ddlIns_insured_relation');
	str8 = getRBelem('rbIns_work');

	// company
	if (notBlank(str1)) {
		addTo(str1);
		prevTxt = true;
	}
	// type
	if (notBlank(str2)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Type: ' + str2);
		prevTxt = true;
	}
	// policy
	if (notBlank(str3)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Policy#: ' + str3);
		prevTxt = true;
	}
	// group
	if (notBlank(str4)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Group: ' + str4);
		prevTxt = true;
	}
	// ss#
	if (notBlank(str5)) {
		if (prevTxt) {
			addComma();
		}
		addTo('SS#: ' + str5);
		prevTxt = true;
	}
	// insured
	if (notBlank(str6)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Insured: ' + str6);
		prevTxt = true;
	}
	// insured relation
	if (notBlank(str7)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Relation: ' + str7);
		prevTxt = true;
	}
	// work related
	if (notBlank(str8)) {
		if (prevTxt) {
			addComma();
		}
		addTo('Work related?: ' + str8);
		prevTxt = true;
	}
	
	if (prevTxt) {
		insertPos("Insurance: ", savedRptPos);
		addReturn();
		addReturn();
	}
}

function writeDispatch() {
	var prevTxt = false;
	var prevTxt2 = false;
	var hstr, str1;
	
	setCHART('C');
	
	hstr = initCap(getTXelem('txtInc_apparatus'));
	if (notBlank(hstr)) {
		addTo(hstr);
		prevTxt = true;
		setUsage('Incident', 'Dispatch');
	}
	hstr = getRBelem('rbShift');
	if (notBlank(hstr)) {
		addSpace(prevTxt);
		addTo(hstr + ' shift');
		prevTxt = true;
		setUsage('Incident', 'Dispatch');
	}
	hstr = getTXelem('txtShift');
	if (notBlank(hstr)) {
		addSpace(prevTxt);
		addTo(hstr + ' shift');
		prevTxt = true;
		setUsage('Incident', 'Dispatch');
	}
	hstr = getRBelem('rbInc_response');
	str1 = getDLelem('ddlInc_ResponseCode');
	if (notBlank(hstr) || notBlank(str1)) {
		if (prevTxt) {addTo(' responds ');} else {addTo('Responds ');}
		if (notBlank(hstr)) { addTo(hstr); }
		if (notBlank(str1)) { addTo(str1); }
		prevTxt = true;
		setUsage('Incident', 'Dispatch');
	}
	hstr = initLowerCap(stripPeriod(getTXelem('txtRespondsTo')));   
	if (notBlank(hstr)) {
		if (prevTxt) {addTo(' to ' + hstr);} else {addTo(initCap(hstr));}
		prevTxt = true;
		setUsage('Incident', 'Dispatch');
	}
	if (prevTxt) {
		addPeriod();
		addReturn();
		addReturn();
	}
}
function writeSubj() {
	var prevTxt = false;
	var prevTxt2 = false;
	var hstr = '';
	var str1 = '';
	var str2 = '';
	var str3 = '';

	setCHART('C');
	
	addTo('S: ');
	
	// CHIEF COMPLAINT
	hstr = initLowerCap(getTXelem('txtChiefComplaint'));
	if (notBlank(hstr)) {
		addTo("Pt's chief complaint is " + hstr);
		addPeriod();
		setUsage('Subjective', 'Chief complaint');
	}
	hstr = getCBelem('cbNoChief');
	if (notBlank(hstr)) {
		addTo(hstr);
		addPeriod();
		setUsage('Subjective', 'Chief complaint');
	}

	setCHART('H');
	
	hstr = initCap(getTXelem('txtPtClaims'));
	if (notBlank(hstr)) {
		addTo(hstr);
		addPeriod();
		setUsage('Subjective', 'Chief complaint');
	}
	
	//OPQRST
	hstr = initCap(getTXelem('txtOnset'));
	if (notBlank(hstr)) {
		addTo("Onset: " + hstr); addPeriod();
		setUsage('Subjective', 'OPQRST');
	}
	hstr = initCap(getTXelem('txtProvokes'));
	if (notBlank(hstr)) {
		addTo("Provokes: " + hstr); addPeriod();
		setUsage('Subjective', 'OPQRST');
	}
	hstr = initCap(getTXelem('txtQuality'));
	if (notBlank(hstr)) {
		addTo("Quality: " + hstr); addPeriod();
		setUsage('Subjective', 'OPQRST');
	}
	hstr = initCap(getTXelem('txtRadiates'));
	if (notBlank(hstr)) {
		addTo("Radiates: " + hstr); addPeriod();
		setUsage('Subjective', 'OPQRST');
	}
	hstr = initCap(getTXelem('txtSeverity'));
	if (notBlank(hstr)) {
		addTo("Severity: " + hstr); addPeriod();
		setUsage('Subjective', 'OPQRST');
	}
	hstr = initCap(getTXelem('txtTime'));
	if (notBlank(hstr)) {
		addTo("Time: " + hstr); addPeriod();
		setUsage('Subjective', 'OPQRST');
	}
	hstr = initCap(getTXelem('txtHxSimilar'));
	if (notBlank(hstr)) {
		addTo("History of similar events: " + hstr); addPeriod();
		setUsage('Subjective', 'OPQRST');
	}
	
	// ADMITS and DENIES
	// admits
	harr = getCB3elem('AD', '+');
	if (harr.length > 0) {
		addTo("Pt admits ");
		prevTxt = true;
		setUsage('Subjective', 'Admits/Denies');
	}
	for (i=0; i<harr.length; i++) {
		addTo(allLowerCap(harr[i].name));
		if (notBlank(harr[i].text)) {
			addTo(": " + harr[i].text);
		}
		if (i < harr.length-1 && notBlank(harr[i].text)) { addSemi(); } // if end of text description add a semicolon
		if (i < harr.length-1 && !notBlank(harr[i].text)) { addComma(); } // if end of just the name add a comma
	}
	if (prevTxt) {
		addPeriod();
	}
	// denies
	prevTxt = false;
	harr = getCB3elem('AD', '-');
	if (harr.length > 0) {
		addTo("Pt denies ");
		prevTxt = true;
		setUsage('Subjective', 'Admits/Denies');
	}
	for (i=0; i<harr.length; i++) {
		addTo(allLowerCap(harr[i].name));
		if (notBlank(harr[i].text)) {
			addTo(": " + harr[i].text);
		}
		if (i < harr.length-1 && notBlank(harr[i].text)) { addSemi(); } // if end of text description add a semicolon
		if (i < harr.length-1 && !notBlank(harr[i].text)) { addComma(); } // if end of just the name add a comma
	}
	if (prevTxt) {
		addPeriod();
	}
	
	// PAST MEDICAL HISTORY
	hstr = getTXelem('txtPastMedHx');
	if (notBlank(hstr)) {
		addTo("PMH: " + hstr);
		addPeriod();
		setUsage('Subjective', 'Hx/Meds/Allergies');
	}
	
	// Rx Meds
	hstr = getTXelem('txtRxMeds');
	if (notBlank(hstr)) {
		addTo("Rx Meds: " + hstr);
		addPeriod();
		setUsage('Subjective', 'Hx/Meds/Allergies');
	}
	
	// OTC Meds
	prevTxt = false;
	prevTxt2 = false;
	str1 = getCBelem('cbOTCAspirin');
	str2 = getCBelem('cbOTCApap');
	str3 = getCBelem('cbOTCIbuprofen');
	hstr = getTXelem('txtOTCOther');
	if (notBlank(str1) || notBlank(str2) || notBlank(str3) || notBlank(hstr)) { prevTxt = true; }
	if (prevTxt) {
		addTo("OTC Meds: ");
		setUsage('Subjective', 'Hx/Meds/Allergies');
	}
	if (notBlank(str1)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(str1);
		prevTxt2 = true;
	}
	if (notBlank(str2)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(str2);
		prevTxt2 = true;
	}
	if (notBlank(str3)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(str3);
		prevTxt2 = true;
	}
	if (notBlank(hstr)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(hstr);
	}
	if (prevTxt) {
		addPeriod();
	}
	
	// ALLERGIES

	prevTxt = false;
	prevTxt2 = false;
	str1 = getCBelem('cbNKDA');
	str2 = getCBelem('cbAllergiesPCN');
	str3 = getCBelem('cbAllergiesSulfa');
	hstr = getTXelem('txtAllergies');
	if (notBlank(str1) || notBlank(str2) || notBlank(str3) || notBlank(hstr)) { prevTxt = true; }
	if (prevTxt) {
		addTo("Allergies: ");
		setUsage('Subjective', 'Hx/Meds/Allergies');
	}
	if (notBlank(str1)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(str1);
		prevTxt2 = true;
	}
	if (notBlank(str2)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(str2);
		prevTxt2 = true;
	}
	if (notBlank(str3)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(str3);
		prevTxt2 = true;
	}
	if (notBlank(hstr)) {
		if (prevTxt2) {
			addComma();
		}
		addTo(hstr);
	}
	if (prevTxt) {
		addPeriod();
	}

	setCHART('T');
	
	// HOSPITAL / DESTINATION PREFERENCE
	prevTxt = false;
	hstr = getDLelem('ddlHospital');
	if (notBlank(hstr)) {
		addTo("Destination Hospital: " + hstr);
		addPeriod();
		prevTxt = true;
		setUsage('Subjective', 'Destination');
	}
	hstr = initCap(getDLelem('ddlHospitalReason'));
	if (notBlank(hstr)) {
		if (prevTxt) {addTo("Reason for hospital choice: ");} else {addTo("Reason for hospital choice: ");}
		addTo(hstr);
		addPeriod();
		setUsage('Subjective', 'Destination');
	}
	addReturn();
	addReturn();
}
function writeObj() {
	var prevTxt = false;
	var prevTxt2 = false;
	var hstr = '';
	var str1 = '';
	var str2 = '';
	var str3 = '';
	var str4 = '';
	var s3exem = {};
	var savedRptPos = 0;
	
	setCHART('C');
	
	addTo("O: ");
	
	str1 = getTXelem('txtAge');
	str2 = getTXelem('weightkg');
	str3 = getTXelem('weightlb');
	str4 = getRBelem('rbGender');
	if (notBlank(str1) || notBlank(str2) || notBlank(str3) || notBlank(str4)) { prevTxt = true; }
	if (prevTxt) {
		addTo("A "); 
		setUsage('Objective', 'Age/Weight/Gender');
	}
	// AGE
	if (notBlank(str1)) {
		addTo(str1 + " " + getDLelem('ddlYears'));
		prevTxt2 = true;
	}
	
	// WEIGHT
	if (notBlank(str2) && notBlank(str3)) {
		if (prevTxt2) { addComma(); }
		addTo("approx. " + str2 + ' kg (' + str3 + ' lb)');
		prevTxt2 = true;
	}
	
	// GENDER
	if (notBlank(str4)) {
		if (prevTxt2) { addComma(); }
		addTo(str4);
		prevTxt2 = true;
	}
	
	if (prevTxt) {
		addTo(" patient");
		addPeriod();
	}
	
	setCHART('A');

	// MENTATION
	hstr = getRBelem('rbMent');
	if (notBlank(hstr)) {
		setUsage('Objective', 'Mentation');
		switch (hstr) {
			case "alert" : 
				str1 = getCBelem('cbAlertPerson');
				str2 = getCBelem('cbAlertPlace');
				str3 = getCBelem('cbAlertTime');
				str4 = getCBelem('cbAlertSituation');
				if (notBlank(str1) && notBlank(str2) && notBlank(str3) && notBlank(str4)) {
					addTo("AAOX4. ");
				} else {
					addTo("Alert to ");
					if (notBlank(str1)) {
						addTo("(+) person");
					} else {
						addTo("(-) person");
					}
					addComma();
					if (notBlank(str2)) {
						addTo("(+) place");
					} else {
						addTo("(-) place");
					}
					addComma();
					if (notBlank(str3)) {
						addTo("(+) time");
					} else {
						addTo("(-) time");
					}
					addComma();
					if (notBlank(str4)) {
						addTo("(+) situation");
					} else {
						addTo("(-) situation");
					}
					addPeriod();
				}
				break;
			case "not alert" :
				str1 = getRBelem('rbMentNA');
				if (notBlank(str1)) {
					if (str1 === "unresponsive") {
						addTo("Unresponsive");
					} else {
						addTo("Responds to " + str1);
					}
					addPeriod();
				} else {
					addTo("Unconscious");
				}
				break;
		}
	}
	
	// GENERAL IMPRESSION
	hstr = initCap(getTXelem('txtGenImpression'));
	if (notBlank(hstr)) {
		addTo(hstr);
		addPeriod();
	}
	
	// AIRWAY
	hstr = getRBelem('rblAirway');
	if (notBlank(hstr)) {
		addTo("Airway: " + hstr);
		addPeriod();
		setUsage('Objective', 'ABC');
	}
	
	// BREATHING
	prevTxt = false;
	prevTxt2 = false;
	str1 = getRBelem('rblBreathReg');
	str2 = getRBelem('rblBreathRate');
	str3 = getRBelem('rblBreathDepth');
	str4 = getRBelem('rblBreathEffort');
	if (notBlank(str1) || notBlank(str2) || notBlank(str3) || notBlank(str4)) { prevTxt = true; }
	if (prevTxt) { 
		addTo("Breathing: ");
		setUsage('Objective', 'ABC');
	}
	if (notBlank(str1)) {
		addTo(str1);
		prevTxt2 = true;
	}
	if (notBlank(str2)) {
		if (prevTxt2) {addComma();}
		addTo(str2);
		prevTxt2 = true;
	}
	if (notBlank(str3)) {
		if (prevTxt2) {addComma();}
		addTo(str3);
		prevTxt2 = true;
	}
	if (notBlank(str4)) {
		if (prevTxt2) {addComma();}
		addTo(str4);
	}
	if (prevTxt) {addPeriod();}
	
	//CIRCULATION
	prevTxt = false;
	prevTxt2 = false;
	hstr = getTXelem('txtCirculation');
	if (notBlank(hstr)) {
		addTo("Circulation: " + hstr);
		prevTxt = true;
		setUsage('Objective', 'ABC');
	}
	hstr = getCBelem('cbCircNoBleeding');
	if (notBlank(hstr)) {
		if (!prevTxt) {
			addTo("Circulation: ");
			prevTxt = true;
			setUsage('Objective', 'ABC');
		} else {
			addComma();
		}
		addTo(hstr);
		addPeriod();
	}
	//SKIN
	prevTxt2 = false;
	str1 = getRBelem('rblSkinColor');
	str2 = getRBelem('rblSkinTemp');
	str3 = getRBelem('rblSkinDryness');
	str4 = getCBelem('cbCapRefill');
	if (notBlank(str1) || notBlank(str2) || notBlank(str3) || notBlank(str4)) { 
		if (!prevTxt) {
			addTo("Circulation - Skin: ");
			prevTxt = true;
			setUsage('Objective', 'ABC');
		} else {
			addTo("Skin: ");
		}
	}
	if (notBlank(str1)) {
		addTo(str1);
		prevTxt2 = true;
	}
	if (notBlank(str2)) {
		if (prevTxt2) {addComma();}
		addTo(str2);
		prevTxt2 = true;
	}
	if (notBlank(str3)) {
		if (prevTxt2) {addComma();}
		addTo(str3);
		prevTxt2 = true;
	}
	if (notBlank(str4)) {
		hstr = getTXelem('txtSkinCapRefill');
		if (notBlank(hstr)) {
			if (prevTxt2) {addComma();}
			addTo(str4 + " " + hstr);
			if (parseInt(hstr) === 1) {
				addTo(" second");
			} else {
				addTo(" seconds");
			}
			prevTxt2 = true;
		}
	}
	if (prevTxt2) {addPeriod();}
	
	//PULSE
	prevTxt2 = false;
	str1 = getRBelem('rblPulsePosition');
	str2 = getRBelem('rblPulseRate');
	str3 = getRBelem('rblPulseRhythm');
	str4 = getRBelem('rblPulseStrength');
	if (notBlank(str1) || notBlank(str2) || notBlank(str3) || notBlank(str4)) { 
		if (!prevTxt) {
			addTo("Circulation - Pulse: ");
			prevTxt = true;
			setUsage('Objective', 'ABC');
		} else {
			addTo("Pulse: ");
		}
	}
	if (notBlank(str1)) {
		addTo(str1);
		prevTxt2 = true;
	}
	if (notBlank(str2)) {
		if (prevTxt2) {addComma();}
		addTo(str2);
		prevTxt2 = true;
	}
	if (notBlank(str3)) {
		if (prevTxt2) {addComma();}
		addTo(str3);
		prevTxt2 = true;
	}
	if (notBlank(str4)) {
		if (prevTxt2) {addComma();}
		addTo(str4);
		prevTxt2 = true;
	}
	if (prevTxt2) {addPeriod();}
	
	// HEAD
	s3exam = new WriteExam('HD', 'HEAD');
	s3exam.natural("Gag Reflex", "gag reflex intact", "no gag reflex");
	s3exam.special('Odor of alcohol', 'odor of alcoholic beverages', 'no odor of alcoholic beverages detected');
	s3exam.write();
	prevTxt = false;
	str1 = getTXelem('pupilsLeft');
	str2 = getTXelem('pupilsRight');
	if (notBlank(str1)) {
		addTo('Pupils left: ' + str1);
		prevTxt = true;
	}
	if (notBlank(str2) && notBlank(str1)) {
		addTo(', right: ' + str2);
		prevTxt = true;
	} else {
		if (notBlank(str2)) {
			addTo('Pupils right: ' + str2);
			prevTxt = true;
		}
	}
	if (prevTxt) {addPeriod();}
	
	// NECK
	s3exam = new WriteExam('NK', 'NECK');
	s3exam.write();
	
	// SHOULDER
	s3exam = new WriteExam('SH', 'SHOULDER');
	s3exam.write();
	
	// CHEST
	s3exam = new WriteExam('CH', 'CHEST');
	s3exam.natural("Equal Rise and Fall", "equal rise and fall", "unequal rise and fall");
	s3exam.write();
	
	// LUNG SOUNDS
	hstr = getCBelem('cbBS');
	if (notBlank(hstr)) {
		addTo("LUNG SOUNDS: clear and equal bilaterally");
		addPeriod();
		setUsage('Objective', 'Lung Sounds');
	} else {
		savedRptPos = savePos(); // locaton for LUNG SOUNDS header
		// loop through each column by each condition
		var pre = ["cbBSClear","cbBSDim","cbBSAbsent","cbBSIWheeze","cbBSEWheeze","cbBSRhonchi","cbBSCrackles"];
		var post = ['UL', 'UR', 'LL', 'LR'];
		prevTxt = false; // follows if there is any checkboxes check so LUNG SOUNDS can be added at the beginning
		var saveLoc = 0; // location of each column header
		for (i=0; i<post.length; i++) {
			saveLoc = savePos();
			prevTxt2 = false; // follows if any checkboxes checked in the column(post array)
			for (j=0; j<pre.length; j++) {
				hstr = getCBelem(pre[j] + post[i]);
				if (notBlank(hstr)) {
					if (prevTxt2) {
						addComma(); 
						addTo(hstr);
					} else {
						addTo(hstr); 
						prevTxt2 = true;
					}
				}
			}
			if (prevTxt2) {
				if (prevTxt) {
					insertPos("; " + post[i]+ ": ", saveLoc);
				} else {
					insertPos(post[i]+ ": ", saveLoc);
				}
				prevTxt = true;
				saveLoc = savePos();
			}
		}
		if (prevTxt) {
			insertPos("LUNG SOUNDS: ", savedRptPos);
			addPeriod();
			setUsage('Objective', 'Lung Sounds');
		}
		
	}
	
	// ABDOMEN
	s3exam = new WriteExam('AB', 'ABDOMEN');
	s3exam.write();
	
	// GU/GI
	s3exam = new WriteExam('GU', 'GU/GI');
	s3exam.write();
	
	// PELVIS
	s3exam = new WriteExam('PV', 'PELVIS');
	s3exam.write();

	// LEGS
	s3exam = new WriteExam('LG', 'LEGS');
	s3exam.natural("CMS", "(+)CMS", "(-)CMS");
	s3exam.write();

	// ARMS
	s3exam = new WriteExam('AR', 'ARMS');
	s3exam.natural("CMS", "(+)CMS", "(-)CMS");
	s3exam.write();

	// CTLS SPINE
	s3exam = new WriteExam('CT', 'CTLS SPINE');
	s3exam.natural("Inline", "inline", "not inline");
	s3exam.special("AMS", "AMS", "no AMS");
	s3exam.special("CTLS Tenderness", "CTLS tenderness", "no CTLS tenderness");
	s3exam.write();

	// BACK
	s3exam = new WriteExam('BK', 'BACK');
	s3exam.write();

	// NEURO
	s3exam = new WriteExam('NU', 'NEURO');
	s3exam.special("Stroke Test", "(+) stroke test", "(-) stroke test");
	s3exam.special("Combative", "combative", "not combative");
	s3exam.special("Confused", "confused", "not confused");
	s3exam.natural("Symmetrical Smile", "symmetrical smile", "asymmetrical smile");
	s3exam.natural("Tongue Aligned", "tongue aligned", "tongue not aligned");
	s3exam.natural("Normal Gait", "normal gait", "abnormal gait");
	s3exam.write();

	// MENTAL STATUS EXAM
	savedRptPos = savePos();
	
	// MSE APPEARANCE/BEHAVIOR
	s3exam = new WriteExam('MSEAPP', 'Appearance/Behavior');
	s3exam.setUnre(false); // does not have a unremarkable checkbox
	s3exam.natural('Calm', 'calm', 'not calm');
	s3exam.natural('Clean', 'clean', 'not clean');
	s3exam.natural('Groomed', 'groomed', 'not groomed');
	s3exam.natural('Cooperative', 'cooperative', 'not cooperative');
	s3exam.special('Confused', 'confused', 'not confused');
	s3exam.special('Agitated', 'agitated', 'not agitated');
	s3exam.special('Restless', 'restless', 'not restless');
	s3exam.special('Lethargic', 'lethargic', 'not lethargic');
	s3exam.write();
	
	// MSE R/ST/LT Memory
	s3exam = new WriteExam('MSEMEM', 'IR/ST/LT Memory');
	s3exam.setUnre(false); // does not have a unremarkable checkbox
	s3exam.natural('Imm. Recall', '(+) immediate recall', '(-) immediate recall');
	s3exam.natural('Short Term', '(+) short term', '(-) short term');
	s3exam.natural('Long Term', '(+) long term', '(-) long term');
	s3exam.natural('Memory intact based on conversation', 'memory intact based on conversation', 'memory not intact based on conversation');
	s3exam.write();
	
	// Cognition/Concentration
	s3exam = new WriteExam('MSECOG', 'Cognition/Concentration');
	s3exam.setUnre(false); // does not have a unremarkable checkbox
	s3exam.natural('WORLD', '(+) WORLD', '(-) WORLD');
	s3exam.natural('$3.75', '(+) $3.75', '(-) $3.75');
	s3exam.natural("Serial 7s", "(+) Serial 7s", "(-) Serial 7s");
	s3exam.natural('Mickey Mouse', '(+) Mickey Mouse', '(-) Mickey Mouse');
	s3exam.natural('Concentrates on questions and answers appropriately', 'concentrates on questions and answers appropriately', 'unable to concentrate on questions and answer appropriately');
	s3exam.write();

	// Insight/Judgement
	s3exam = new WriteExam('MSEJUD', 'Insight/Judgement');
	s3exam.setUnre(false); // does not have a unremarkable checkbox
	s3exam.natural('Makes a plan', 'makes a plan', 'unable to make a plan');
	s3exam.natural('Accepts a plan', 'accepts a plan', 'unable to accept a plan');
	s3exam.natural('Problem solves', 'problem solves', 'unable to problem solve');
	s3exam.write();
	
	// Thoughts
	s3exam = new WriteExam('MSETHO', 'Thoughts');
	s3exam.setUnre(false); // does not have a unremarkable checkbox
	s3exam.natural('Linear', 'linear', 'not linear');
	s3exam.natural('Logical', 'logical', 'not logical');
	s3exam.special('Tangential', 'tangential', 'not tangential');
	s3exam.special('Psychotic', 'psychotic', 'not psychotic');
	s3exam.write();

	// Speech
	s3exam = new WriteExam('MSESPE', 'Speech');
	s3exam.setUnre(false); // does not have a unremarkable checkbox
	s3exam.natural('Clear', 'clear', 'not clear');
	s3exam.natural('Appropriate words', 'appropriate words', 'inappropriate words');
	s3exam.special('Slurred', 'slurred', 'not slurred');
	s3exam.special('Mumbles', 'mumbles', 'does not mumble');
	s3exam.write();
	
	insertPos("MENTAL STATUS: ", savedRptPos); // insert the title of the section if something was added
	
	// ENVIRONMENT
	savedRptPos = savePos();
	
	// Home
	s3exam = new WriteExam('ENVHome', 'Home');
	s3exam.setUnre(false); // does not have a unremarkable checkbox
	s3exam.natural('Clean', 'clean', 'not clean');
	s3exam.natural('Lives alone', 'lives alone', 'does not live alone');
	s3exam.special('Lives with others', 'lives with others', 'does not live with others');
	s3exam.special('Cluttered', 'cluttered', 'not cluttered');
	s3exam.write();

	// People present
	s3exam = new WriteExam('ENVPeep', 'People Present');
	s3exam.setUnre(false);
	s3exam.natural('Family', 'family', 'no family');
	s3exam.natural('Friends', 'friends', 'no friends');
	s3exam.natural('Is alone', 'is alone', 'is not alone');
	s3exam.write();

	// Weather
	s3exam = new WriteExam('ENVWx', 'Weather');
	s3exam.setUnre(false); 
	s3exam.special('Hot', 'hot', 'not hot');
	s3exam.special('Cold', 'cold', 'not cold');
	s3exam.special('Wet', 'wet', 'dry');
	s3exam.special('High altitude', 'high altitude', 'not high altitude');
	s3exam.write();

	insertPos("ENVIRONMENT: ", savedRptPos); // insert the title of the section if something was added
	
	// CURRENT MOBILITY
	s3exam = new WriteExam('MOBmob', 'CURRENT MOBILITY');
	s3exam.setUnre(false); 
	s3exam.natural('Able to walk', 'able to walk', 'unable to walk');
	s3exam.special('With assistance', 'with assistance', 'without assistance');
	s3exam.special('Wheelchair', 'uses a wheelchair', 'does not use a wheelchair');
	s3exam.special('Walker', 'uses a walker', 'does not use a walker');
	s3exam.special('Cane', 'uses a cane', 'does not use a cane');
	s3exam.special('Confined to bed', 'confined to their bed', 'not confined to their bed');
	s3exam.write();
	
	// PT PROPERTY
	prevTxt = false;
	hstr = getCBelem('cbPROPnone');
	if (notBlank(hstr)) {
		addTo("PT PROPERTY: no property taken");
		prevTxt = true;
		setUsage('Objective', 'Pt Property');
	}
	str1 = getTXelem('txtPROP');
	if (notBlank(str1)) {
		if (!prevTxt) {
			addTo("PT PROPERTY: ");
		} else { addComma(); }
		addTo(str1);
		prevTxt = true;
		setUsage('Objective', 'Pt Property');
	}
	if (prevTxt) { addPeriod(); }
	
	
	// OTHER
	hstr = initCap(getTXelem("txtOTHR"));
	if (notBlank(hstr)) {
		addTo(hstr);
		addPeriod();
		setUsage('Objective', 'Other');
	}
	
	// ASSESSMENT SPECIFIC DOCUMENTATION
	var asspec_report_position = savePos();
	asspec_prevTxt = false;
	$('#divASSPEC input[type=checkbox]').each(function () {	
		setCHART('A');
		if (this.checked) {
			switch (this.id) {
			case 'cbASSPEC_CHESTPAIN': 	write_ASSPEC_CHESTPAIN(); break;
			case 'cbASSPEC_HTN': 		write_ASSPEC_HTN(); break;
			case 'cbASSPEC_HYPERG': 	write_ASSPEC_HYPERG(); break;
			case 'cbASSPEC_HYPOG': 		write_ASSPEC_HYPOG(); break;
			case 'cbASSPEC_ALT': 		write_ASSPEC_ALT(); break;
			case 'cbASSPEC_BITE': 		write_ASSPEC_BITE(); break;
			case 'cbASSPEC_BURN': 		write_ASSPEC_BURN(); break;
			case 'cbASSPEC_CO': 		write_ASSPEC_CO(); break;
			case 'cbASSPEC_HYPOT': 		write_ASSPEC_HYPOT(); break;
			case 'cbASSPEC_HAZMAT': 	write_ASSPEC_HAZMAT(); break;
			case 'cbASSPEC_HYPERT': 	write_ASSPEC_HYPERT(); break;
			case 'cbASSPEC_ABPN': 		write_ASSPEC_ABPN(); break;
			case 'cbASSPEC_DEHYD': 		write_ASSPEC_DEHYD(); break;
			case 'cbASSPEC_GI': 		write_ASSPEC_GI(); break;
			case 'cbASSPEC_FLU': 		write_ASSPEC_FLU(); break;
			case 'cbASSPEC_AMS': 		write_ASSPEC_AMS(); break;
			case 'cbASSPEC_CVA': 		write_ASSPEC_CVA(); break;
			case 'cbASSPEC_SYNC': 		write_ASSPEC_SYNC(); break;
			case 'cbASSPEC_SZ': 		write_ASSPEC_SZ(); break;
			case 'cbASSPEC_OB': 		write_ASSPEC_OB(); break;
			case 'cbASSPEC_BIRTH': 		write_ASSPEC_BIRTH(); break;
			case 'cbASSPEC_VAG': 		write_ASSPEC_VAG(); break;
			case 'cbASSPEC_NPAIN': 		write_ASSPEC_NPAIN(); break;
			case 'cbASSPEC_PSYCH': 		write_ASSPEC_PSYCH(); break;
			case 'cbASSPEC_APNEA': 		write_ASSPEC_APNEA(); break;
			case 'cbASSPEC_RESP': 		write_ASSPEC_RESP(); break;
			case 'cbASSPEC_SHOCK': 		write_ASSPEC_SHOCK(); break;
			case 'cbASSPEC_OD': 		write_ASSPEC_OD(); break;
			case 'cbASSPEC_MVC': 		write_ASSPEC_MVC(); break;
			case 'cbASSPEC_TRAUMA': 	write_ASSPEC_TRAUMA(); break;
			case 'cbASSPEC_NOSE': 		write_ASSPEC_NOSE(); break;
			case 'cbASSPEC_FEVER': 		write_ASSPEC_FEVER(); break;
			case 'cbASSPEC_SEX': 		write_ASSPEC_SEX(); break;
			case 'cbASSPEC_ALLERGIC': 	write_ASSPEC_ALLERGIC(); break;
			}
		}
	});
	if (asspec_prevTxt) {
		insertPos("Assessment Specific Exam: ", asspec_report_position);
		addPeriod();
	}

	addReturn();
	addReturn();
}

function write_ASSPEC_content(str, title) {
	var prevTxt = false, str_empty = true;
	for (var i=0; i<str.length; i++) {
		if (str[i] !== "") { str_empty = false; }
	}
	if (asspec_prevTxt && !str_empty) { addSemi(); }
	for (var i=0; i<str.length; i++) { 
		if (notBlank(str[i])) {
			if (prevTxt) { addSemi(); }
			if (notBlank(title[i]) && title[i] !== undefined) { addTo(title[i] + ' '); }
			addTo(str[i]);
			prevTxt = true;
		}
	}
	if (prevTxt) {
		asspec_prevTxt = true;
	}
}
function write_ASSPEC_CHESTPAIN() {
	var str=[], title=[];	
	str[str.length] = getRBelem('ASSPEC_chestpain_edema');
	str[str.length] = getRBelem('ASSPEC_chestpain_ascites');
	str[str.length] = getRBelem('ASSPEC_chestpain_JVD');
	str[str.length] = getRBelem('ASSPEC_chestpain_backpain');
	str[str.length] = stripPeriod(getTXelem('ASSPEC_chestpain_doc'));
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Chestpain');
}
function write_ASSPEC_HTN() {
	var str=[], title=[];	
	str[str.length] = getRBelem('ASSPEC_HTN_medications');
	str[str.length] = getRBelem('ASSPEC_HTN_photophobia');
	str[str.length] = getRBelem('ASSPEC_HTN_cardiogenic');
	str[str.length] = getCBelem('ASSPEC_HTN_rigidity');
	str[str.length] = getCBelem('ASSPEC_HTN_brudzinski');
	str[str.length] = getCBelem('ASSPEC_HTN_kernig');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Hypertention');
}
function write_ASSPEC_HYPERG() {
	var str=[], title=[];	
	str[str.length] = getRBelem('ASSPEC_HYPERG_history');
	str[str.length] = getRBelem('ASSPEC_HYPERG_medications');
	title[str.length] = 'last oral intake -';
	str[str.length] = getTXelem('ASSPEC_HYPERG_oral');
	title[str.length] = 'duration of symptoms -';
	str[str.length] = getTXelem('ASSPEC_HYPERG_duration');
	str[str.length] = getRBelem('ASSPEC_HYPERG_dehydration');
	str[str.length] = getRBelem('ASSPEC_HYPERG_abpn');
	str[str.length] = getRBelem('ASSPEC_HYPERG_alcohol');
	str[str.length] = getRBelem('ASSPEC_HYPERG_seizures');
	str[str.length] = getRBelem('ASSPEC_HYPERG_infection');
	str[str.length] = getRBelem('ASSPEC_HYPERG_overdose');
	str[str.length] = getRBelem('ASSPEC_HYPERG_uremia');
	str[str.length] = getRBelem('ASSPEC_HYPERG_trauma');
	str[str.length] = getRBelem('ASSPEC_HYPERG_psych');
	str[str.length] = getRBelem('ASSPEC_HYPERG_shock');
	str[str.length] = getRBelem('ASSPEC_HYPERG_stroke');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Hyperglycemia');
}
function write_ASSPEC_HYPOG() {
	var str=[], title=[];	
	str[str.length] = getRBelem('ASSPEC_HYPOG_history');
	str[str.length] = getRBelem('ASSPEC_HYPOG_medications');
	title[str.length] = 'type of insulin -';
	str[str.length] = getTXelem('ASSPEC_HYPOG_insulin');
	title[str.length] = 'insulin schedule -';
	str[str.length] = getTXelem('ASSPEC_HYPOG_inschedule');
	title[str.length] = 'last oral intake -';
	str[str.length] = getTXelem('ASSPEC_HYPOG_oral');
	title[str.length] = 'duration of symptoms -';
	str[str.length] = getTXelem('ASSPEC_HYPOG_duration');
	title[str.length] = 'nutritional status -';
	str[str.length] = getTXelem('ASSPEC_HYPOG_nutrition');
	str[str.length] = getRBelem('ASSPEC_HYPOG_alcohol');
	str[str.length] = getRBelem('ASSPEC_HYPOG_seizures');
	str[str.length] = getRBelem('ASSPEC_HYPOG_infection');
	str[str.length] = getRBelem('ASSPEC_HYPOG_overdose');
	str[str.length] = getRBelem('ASSPEC_HYPOG_uremia');
	str[str.length] = getRBelem('ASSPEC_HYPOG_trauma');
	str[str.length] = getRBelem('ASSPEC_HYPOG_psych');
	str[str.length] = getRBelem('ASSPEC_HYPOG_shock');
	str[str.length] = getRBelem('ASSPEC_HYPOG_stroke');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Hypoglycemia');
}
function write_ASSPEC_ALT() {
	var str=[], title=[];	
	title[str.length] = 'home city or altitude -';
	str[str.length] = getTXelem('ASSPEC_ALT_home');
	title[str.length] = 'time at current altitude -';
	str[str.length] = getTXelem('ASSPEC_ALT_time');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Altitude');
}
function write_ASSPEC_BITE() {
	var str=[], title=[];
	title[str.length] = 'time of envenomation -';
	str[str.length] = getTXelem('ASSPEC_BITE_time');
	title[str.length] = 'type of envenomation -';
	str[str.length] = getTXelem('ASSPEC_BITE_type');
	title[str.length] = 'identification of animal -';
	str[str.length] = getTXelem('ASSPEC_BITE_id');
	title[str.length] = 'activity since envenomation -';
	str[str.length] = getTXelem('ASSPEC_BITE_activity');
	title[str.length] = 'envenomation site -';
	str[str.length] = getTXelem('ASSPEC_BITE_site');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Bite');
}
function write_ASSPEC_BURN() {
	var str=[], title=[];
	title[str.length] = 'method of burn -';
	str[str.length] = getTXelem('ASSPEC_BURN_method');
	title[str.length] = 'percentage of burn area -';
	str[str.length] = getTXelem('ASSPEC_BURN_percentage');
	title[str.length] = 'depth of burn -';
	str[str.length] = getTXelem('ASSPEC_BURN_depth');
	title[str.length] = 'location of burn -';
	str[str.length] = getTXelem('ASSPEC_BURN_location');
	str[str.length] = getRBelem('ASSPEC_BURN_respiratory');
	str[str.length] = stripPeriod(getTXelem('ASSPEC_BURN_doc'));
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Burn');
}
function write_ASSPEC_CO() {
	var str=[], title=[];
	title[str.length] = 'environmental factors -';
	str[str.length] = getTXelem('ASSPEC_CO_environment');
	title[str.length] = 'type of fire -';
	str[str.length] = getTXelem('ASSPEC_CO_type');
	title[str.length] = 'duration of exposure -';
	str[str.length] = getTXelem('ASSPEC_CO_duration');
	title[str.length] = 'environmental CO -';
	str[str.length] = getTXelem('ASSPEC_CO_coreading');
	title[str.length] = 'CO-oximetry -';
	str[str.length] = getTXelem('ASSPEC_CO_coox');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'CO');
}
function write_ASSPEC_HYPOT() {
	var str=[], title=[];
	title[str.length] = 'ambient temperature -';
	str[str.length] = getTXelem('ASSPEC_HYPOT_environment');
	title[str.length] = 'body temperature -';
	str[str.length] = getTXelem('ASSPEC_HYPOT_temperature');
	title[str.length] = 'location of injury -';
	str[str.length] = getTXelem('ASSPEC_HYPOT_location');
	title[str.length] = 'duration in environment -';
	str[str.length] = getTXelem('ASSPEC_HYPOT_duration');
	title[str.length] = 'warming method -';
	str[str.length] = getTXelem('ASSPEC_HYPOT_warm');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Hypothermia');
}
function write_ASSPEC_HAZMAT() {
	var str=[], title=[];
	title[str.length] = 'type of exposure -';
	str[str.length] = getTXelem('ASSPEC_HAZMAT_exposure');
	title[str.length] = 'duration of exposure -';
	str[str.length] = getTXelem('ASSPEC_HAZMAT_duration');
	title[str.length] = 'pre-arrival treatment -';
	str[str.length] = getTXelem('ASSPEC_HAZMAT_pta');
	title[str.length] = 'ID of substance -';
	str[str.length] = getTXelem('ASSPEC_HAZMAT_id');
	title[str.length] = 'decontamination method -';
	str[str.length] = getTXelem('ASSPEC_HAZMAT_decon');
	str[str.length] = stripPeriod(getTXelem('ASSPEC_HAZMAT_doc'));
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Hazmat');
}
function write_ASSPEC_HYPERT() {
	var str=[], title=[];
	title[str.length] = 'ambient temperature -';
	str[str.length] = getTXelem('ASSPEC_HYPERT_ambient');
	title[str.length] = 'body temperature -';
	str[str.length] = getTXelem('ASSPEC_HYPERT_body');
	title[str.length] = 'cooling method -';
	str[str.length] = getTXelem('ASSPEC_HYPERT_cool');
	title[str.length] = 'precipitating factors -';
	str[str.length] = getTXelem('ASSPEC_HYPERT_factors');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Hyperthermia');
}
function write_ASSPEC_ABPN() {
	var str=[], title=[];
	title[str.length] = 'GI/GU history -';
	str[str.length] = getTXelem('ASSPEC_ABPN_history');
	title[str.length] = 'GI/GU surgeries -';
	str[str.length] = getTXelem('ASSPEC_ABPN_surgeries');
	str[str.length] = getRBelem('ASSPEC_ABPN_nausea');
	str[str.length] = getRBelem('ASSPEC_ABPN_vomiting');
	str[str.length] = getRBelem('ASSPEC_ABPN_diarrhea');
	str[str.length] = getRBelem('ASSPEC_ABPN_fever');
	str[str.length] = getRBelem('ASSPEC_ABPN_pain');
	str[str.length] = getRBelem('ASSPEC_ABPN_trauma');
	str[str.length] = stripPeriod(getTXelem('ASSPEC_ABPN_doc'));
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Ab Pain');
}
function write_ASSPEC_DEHYD() {
	var str=[], title=[];
	title[str.length] = 'recent travel -';
	str[str.length] = getTXelem('ASSPEC_DEHYD_travel');
	title[str.length] = 'frequency/duration -';
	str[str.length] = getTXelem('ASSPEC_DEHYD_frequency');
	title[str.length] = 'dietary changes -';
	str[str.length] = getTXelem('ASSPEC_DEHYD_diet');
	title[str.length] = 'GI/GU history -';
	str[str.length] = getTXelem('ASSPEC_DEHYD_history');
	title[str.length] = 'emesis/stool -';
	str[str.length] = getTXelem('ASSPEC_DEHYD_description');
	str[str.length] = getRBelem('ASSPEC_DEHYD_origin');
	str[str.length] = getRBelem('ASSPEC_DEHYD_temperature');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Dehydration');
}
function write_ASSPEC_GI() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_GI_ulcers');
	str[str.length] = getRBelem('ASSPEC_GI_etoh');
	title[str.length] = 'emesis/stool -';
	str[str.length] = getTXelem('ASSPEC_GI_description');
	str[str.length] = getRBelem('ASSPEC_GI_origin');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'GI Bleed');
}
function write_ASSPEC_FLU() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_FLU_nystagmus');
	title[str.length] = 'associated trauma -';
	str[str.length] = getTXelem('ASSPEC_FLU_trauma');
	title[str.length] = 'emesis -';
	str[str.length] = getTXelem('ASSPEC_FLU_description');
	title[str.length] = 'provoking factors -';
	str[str.length] = getTXelem('ASSPEC_FLU_provokes');
	str[str.length] = stripPeriod(getTXelem('ASSPEC_FLU_doc'));
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Flu-like');
}
function write_ASSPEC_AMS() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_AMS_nystagmus');
	str[str.length] = getRBelem('ASSPEC_AMS_double');
	str[str.length] = getRBelem('ASSPEC_AMS_ataxia');
	str[str.length] = getRBelem('ASSPEC_AMS_origin');
	str[str.length] = getRBelem('ASSPEC_AMS_alcohol');
	str[str.length] = getRBelem('ASSPEC_AMS_seizures');
	str[str.length] = getRBelem('ASSPEC_AMS_infection');
	str[str.length] = getRBelem('ASSPEC_AMS_diabetes');
	str[str.length] = getRBelem('ASSPEC_AMS_overdose');
	str[str.length] = getRBelem('ASSPEC_AMS_uremia');
	str[str.length] = getRBelem('ASSPEC_AMS_trauma');
	str[str.length] = getRBelem('ASSPEC_AMS_psych');
	str[str.length] = getRBelem('ASSPEC_AMS_shock');
	str[str.length] = getRBelem('ASSPEC_AMS_stroke');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'AMS');
}
function write_ASSPEC_CVA() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_CVA_aphasia');
	str[str.length] = getRBelem('ASSPEC_CVA_dysphasia');
	str[str.length] = getRBelem('ASSPEC_CVA_droop');
	str[str.length] = getRBelem('ASSPEC_CVA_drift');
	str[str.length] = getRBelem('ASSPEC_CVA_nystagmus');
	title[str.length] = 'time of onset -';
	str[str.length] = getTXelem('ASSPEC_CVA_time');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'CVA');
}
function write_ASSPEC_SYNC() {
	var str=[], title=[];
	title[str.length] = 'events prior to episode -';
	str[str.length] = getTXelem('ASSPEC_SYNC_events');
	title[str.length] = 'previous episodes -';
	str[str.length] = getTXelem('ASSPEC_SYNC_history');
	str[str.length] = getRBelem('ASSPEC_SYNC_trauma');
	str[str.length] = getRBelem('ASSPEC_SYNC_vertigo');
	str[str.length] = getRBelem('ASSPEC_SYNC_seizure');
	str[str.length] = getRBelem('ASSPEC_SYNC_fluid');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Syncope');
}
function write_ASSPEC_SZ() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_SZ_history');
	str[str.length] = getRBelem('ASSPEC_SZ_compliant');
	str[str.length] = getRBelem('ASSPEC_SZ_aura');
	str[str.length] = getRBelem('ASSPEC_SZ_oral');
	str[str.length] = getRBelem('ASSPEC_SZ_incontinence');
	str[str.length] = getCBelem('ASSPEC_SZ_rigidity');
	str[str.length] = getCBelem('ASSPEC_SZ_brudzinski');
	str[str.length] = getCBelem('ASSPEC_SZ_kernig');
	title[str.length] = 'seizure activity -';
	str[str.length] = getTXelem('ASSPEC_SZ_activity');
	title[str.length] = 'postictal period -';
	str[str.length] = getTXelem('ASSPEC_SZ_postictal');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Seizure');
}
function write_ASSPEC_OB() {
	var str=[], title=[];
	title[str.length] = 'contractions/abdominal pain -';
	str[str.length] = getTXelem('ASSPEC_OB_contractions');
	title[str.length] = 'duration/timing of contractions -';
	str[str.length] = getTXelem('ASSPEC_OB_timing');
	str[str.length] = getRBelem('ASSPEC_OB_water');
	title[str.length] = 'amniotic fluid -';
	str[str.length] = getTXelem('ASSPEC_OB_amniotic');
	title[str.length] = 'gravida -';
	str[str.length] = getTXelem('ASSPEC_OB_gravida');
	title[str.length] = 'para -';
	str[str.length] = getTXelem('ASSPEC_OB_para');
	title[str.length] = 'due date -';
	str[str.length] = getTXelem('ASSPEC_OB_duedate');
	title[str.length] = 'known problems -';
	str[str.length] = getTXelem('ASSPEC_OB_problems');
	title[str.length] = 'prenatal care -';
	str[str.length] = getTXelem('ASSPEC_OB_prenatal');
	title[str.length] = 'social support -';
	str[str.length] = getTXelem('ASSPEC_OB_social');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'OB');
}
function write_ASSPEC_BIRTH() {
	var str=[], title=[];
	title[str.length] = 'due date -';
	str[str.length] = getTXelem('ASSPEC_BIRTH_duedate');
	title[str.length] = 'time of birth -';
	str[str.length] = getTXelem('ASSPEC_BIRTH_birthtime');
	title[str.length] = 'type of presentation -';
	str[str.length] = getTXelem('ASSPEC_BIRTH_presentation');
	str[str.length] = getRBelem('ASSPEC_BIRTH_sex');
	title[str.length] = 'time cord cut -';
	str[str.length] = getTXelem('ASSPEC_BIRTH_cord');
	str[str.length] = getRBelem('ASSPEC_BIRTH_placenta');
	str[str.length] = getRBelem('ASSPEC_BIRTH_meconium');
	title[str.length] = '1 minute APGAR score = ';
	str[str.length] = apgar_score1();
	var s1pos = str.length;
	str[str.length] = getRBelem('ASSPEC_BIRTH_1activity');
	str[str.length] = getRBelem('ASSPEC_BIRTH_1pulse');
	str[str.length] = getRBelem('ASSPEC_BIRTH_1grimace');
	str[str.length] = getRBelem('ASSPEC_BIRTH_1appearance');
	str[str.length] = getRBelem('ASSPEC_BIRTH_1respiration');
	title[str.length] = '5 minute APGAR score = ';
	str[str.length] = apgar_score5();
	var s5pos = str.length;
	str[str.length] = getRBelem('ASSPEC_BIRTH_5activity');
	str[str.length] = getRBelem('ASSPEC_BIRTH_5pulse');
	str[str.length] = getRBelem('ASSPEC_BIRTH_5grimace');
	str[str.length] = getRBelem('ASSPEC_BIRTH_5appearance');
	str[str.length] = getRBelem('ASSPEC_BIRTH_5respiration');
	if ( !notBlank(str[s1pos]) && !notBlank(str[s1pos+1]) && !notBlank(str[s1pos+2]) && !notBlank(str[s1pos+3]) && !notBlank(str[s1pos+4]) ) { // true = all are blank
		str[s1pos-1] = ''; // set score to blank so it will not print
	}
	if ( !notBlank(str[s5pos]) && !notBlank(str[s5pos+1]) && !notBlank(str[s5pos+2]) && !notBlank(str[s5pos+3]) && !notBlank(str[s5pos+4]) ) { // true = all are blank
		str[s5pos-1] = ''; // set score to blank so it will not print
	}
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Birth');
}
function write_ASSPEC_VAG() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_VAG_possibility');
	title[str.length] = 'due date -';
	str[str.length] = getTXelem('ASSPEC_VAG_duedate');
	title[str.length] = 'last menstrual period -';
	str[str.length] = getTXelem('ASSPEC_VAG_period');
	title[str.length] = 'blood loss -';
	str[str.length] = getTXelem('ASSPEC_VAG_volume');
	title[str.length] = 'blood/discharge description -';
	str[str.length] = getTXelem('ASSPEC_VAG_blood');
	title[str.length] = 'history of OB/GYN complications -';
	str[str.length] = getTXelem('ASSPEC_VAG_history');
	str[str.length] = getRBelem('ASSPEC_VAG_trauma');
	str[str.length] = getRBelem('ASSPEC_VAG_abuse');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Vaginal Bleed');
}
function write_ASSPEC_NPAIN() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_NPAIN_chronic');
	title[str.length] = 'frequency / duration -';
	str[str.length] = getTXelem('ASSPEC_NPAIN_frequency');
	title[str.length] = 'location of pain -';
	str[str.length] = getTXelem('ASSPEC_NPAIN_location');
	title[str.length] = 'distribution of pain -';
	str[str.length] = getTXelem('ASSPEC_NPAIN_distribution');
	str[str.length] = stripPeriod(getTXelem('ASSPEC_NPAIN_doc'));
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Non-traumatic pain');
}
function write_ASSPEC_PSYCH() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_PSYCH_suicidal');
	title[str.length] = 'suicidal plan -';
	str[str.length] = getTXelem('ASSPEC_PSYCH_plan');
	title[str.length] = 'ability to carry out plan -';
	str[str.length] = getTXelem('ASSPEC_PSYCH_ability');
	str[str.length] = getRBelem('ASSPEC_PSYCH_depression');
	str[str.length] = getRBelem('ASSPEC_PSYCH_history');
	str[str.length] = getRBelem('ASSPEC_PSYCH_etoh');
	str[str.length] = getRBelem('ASSPEC_PSYCH_onset');
	str[str.length] = getRBelem('ASSPEC_PSYCH_compliant');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Psych');
}
function write_ASSPEC_APNEA() {
	var str=[], title=[];
	title[str.length] = 'duration of episode -';
	str[str.length] = getTXelem('ASSPEC_APNEA_duration');
	title[str.length] = 'pre-arrival treatment -';
	str[str.length] = getTXelem('ASSPEC_APNEA_treatment');
	title[str.length] = 'history of previous episodes -';
	str[str.length] = getTXelem('ASSPEC_APNEA_history');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Apnea');
}
function write_ASSPEC_RESP() {
	var str=[], title=[];
	title[str.length] = 'duration of episode -';
	str[str.length] = getTXelem('ASSPEC_RESP_duration');
	title[str.length] = 'pre-arrival treatment -';
	str[str.length] = getTXelem('ASSPEC_RESP_treatment');
	title[str.length] = 'previous episodes -';
	str[str.length] = getTXelem('ASSPEC_RESP_history');
	title[str.length] = 'previous intubations/ICU -';
	str[str.length] = getTXelem('ASSPEC_RESP_intubations');
	str[str.length] = getRBelem('ASSPEC_RESP_JVD');
	str[str.length] = getRBelem('ASSPEC_RESP_reflex');
	str[str.length] = getRBelem('ASSPEC_RESP_edema');
	str[str.length] = getRBelem('ASSPEC_RESP_ascites');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Respiratory');
}
function write_ASSPEC_SHOCK() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_SHOCK_JVD');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Shock');
}
function write_ASSPEC_OD() {
	var str=[], title=[];
	title[str.length] = 'type of ingestion/poisoning -';
	str[str.length] = getTXelem('ASSPEC_OD_type');
	title[str.length] = 'ID of substance -';
	str[str.length] = getTXelem('ASSPEC_OD_id');
	str[str.length] = getRBelem('ASSPEC_OD_intention');
	str[str.length] = getRBelem('ASSPEC_OD_contact');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'OD');
}
function write_ASSPEC_MVC() {

	// VEHICLE
	addTo("VEHICLE: ");
	
	// Type
	s3exam = new WriteExam('TAType', 'Type');
	s3exam.setUnre(false); 
	s3exam.write();

	// Direction
	s3exam = new WriteExam('TADir', 'Direction');
	s3exam.setUnre(false); 
	s3exam.natural('Northbound', 'northbound', 'not northbound');
	s3exam.natural('Southbound', 'southbound', 'not southbound');
	s3exam.natural('Eastbound', 'eastbound', 'not eastbound');
	s3exam.natural('Westbound', 'westbound', 'not westbound');
	s3exam.write();

	// Speed
	s3exam = new WriteExam('TASpeed', 'Speed');
	s3exam.setUnre(false); 
	s3exam.write();

	// Weather
	s3exam = new WriteExam('TAWx', 'Weather');
	s3exam.setUnre(false); 
	s3exam.natural('Clear', 'clear', 'not clear');
	s3exam.natural('Dry Road', 'dry road', 'wet road');
	s3exam.special('Icy Road', 'icy road', 'road not icy');
	s3exam.special('Raining', 'raining', 'not raining');
	s3exam.special('Snowing', 'snowing', 'not snowing');
	s3exam.special('Fog', 'fog', 'no fog');
	s3exam.write();

	// Impact
	s3exam = new WriteExam('TAImp', 'Impact');
	s3exam.setUnre(false); 
	s3exam.special('Frontal', 'frontal', 'not frontal');
	s3exam.special('Rear-end', 'rear-end', 'not rear-end');
	s3exam.special('Lateral', 'lateral', 'not lateral');
	s3exam.special('Rotational', 'rotational', 'not rotational');
	s3exam.special('Rollover', 'rollover', 'not a rollover');
	s3exam.special('Angular', 'angular', 'not angular');
	s3exam.write();

	// Dash
	s3exam = new WriteExam('TADash', 'Dash');
	s3exam.setUnre(false); 
	s3exam.natural('Intact', 'intact', 'not intact');
	s3exam.special('Damaged', 'damaged', 'not damaged');
	s3exam.write();
	
	// Windshield
	s3exam = new WriteExam('TAWind', 'Windshield');
	s3exam.setUnre(false); 
	s3exam.natural('Intact', 'intact', 'not intact');
	s3exam.special('Star pattern', 'star pattern', 'no star pattern');
	s3exam.special('Damaged', 'damaged', 'not damaged');
	s3exam.write();

	// Steering wheel
	s3exam = new WriteExam('TASW', 'Steering Wheel');
	s3exam.setUnre(false); 
	s3exam.natural('Intact', 'intact', 'not intact');
	s3exam.special('Deformed', 'deformed', 'not deformed');
	s3exam.write();
	
	// Intrusion
	s3exam = new WriteExam('TAInt', 'Intrusion');
	s3exam.setUnre(false); 
	s3exam.natural('No intrusion', 'no intrusion', 'intrusion');
	s3exam.special('Mild', 'Mild', 'not mild');
	s3exam.special('Moderate', 'moderate', 'not moderate');
	s3exam.special('Significant', 'significant', 'not significant');
	s3exam.write();

	// Airbags
	s3exam = new WriteExam('TAAir', 'Airbags');
	s3exam.setUnre(false); 
	s3exam.natural('No airbags', 'no airbags', 'airbags');
	s3exam.natural('Airbags deployed', 'airbags deployed', 'no airbags deployed');
	s3exam.write();
	
	// Position in car
	s3exam = new WriteExam('TAPos', 'Pt Position');
	s3exam.setUnre(false); 
	s3exam.special('Driver', 'driver', 'not the driver');
	s3exam.special('Front Passenger', 'front passenger', 'not the front passenger');
	s3exam.special('Rear Passenger', 'rear passenger', 'not the rear passenger');
	s3exam.write();

	// Pt seatbelt
	s3exam = new WriteExam('TASB', 'Seatbelt');
	s3exam.setUnre(false); 
	s3exam.natural('Secured with seatbelt', 'secured with a seatbelt', 'not secured with a seatbelt');
	s3exam.write();

	// MOI
	s3exam = new WriteExam('TAMOI', 'MOI');
	s3exam.setUnre(false); 
	s3exam.natural('No injury', 'no injury', 'with injury');
	s3exam.special('Airbag injury', 'airbag injury', 'no airbag injury');
	s3exam.special('Into steering wheel', 'into the steering wheel', 'not into the steering wheel');
	s3exam.special('Up and over', 'up and over', 'not up and over');
	s3exam.special('Down and under', 'down and under', 'not down and under');
	s3exam.special('Ejection', 'ejection', 'no ejection');
	s3exam.write();

	// Damage
	s3exam = new WriteExam('TADam', 'Damage');
	s3exam.setUnre(false); 
	s3exam.natural('No damage', 'no damage', 'with damage');
	s3exam.special('Mild', 'mild', 'not mild');
	s3exam.special('Moderate', 'moderate', 'not moderate');
	s3exam.special('Significant', 'significant', 'not significant');
	s3exam.write();

	setUsage('Asspec', 'MVC');
}
function write_ASSPEC_TRAUMA() {
	var str=[], title=[];
	title[str.length] = 'mechanism of injury -';
	str[str.length] = getTXelem('ASSPEC_TRAUMA_mechanism');
	title[str.length] = 'safety equipment used -';
	str[str.length] = getTXelem('ASSPEC_TRAUMA_safety');
	str[str.length] = getRBelem('ASSPEC_TRAUMA_intentional');
	str[str.length] = stripPeriod(getTXelem('ASSPEC_TRAUMA_doc'));
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Trauma');
}
function write_ASSPEC_NOSE() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_NOSE_hypert');
	str[str.length] = getRBelem('ASSPEC_NOSE_thinner');
	str[str.length] = getRBelem('ASSPEC_NOSE_cart');
	title[str.length] = 'associated trauma -';
	str[str.length] = getTXelem('ASSPEC_NOSE_trauma');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Nose bleed');
}
function write_ASSPEC_FEVER() {
	var str=[], title=[];
	str[str.length] = getCBelem('ASSPEC_FEVER_rigidity');
	str[str.length] = getCBelem('ASSPEC_FEVER_brudzinski');
	str[str.length] = getCBelem('ASSPEC_FEVER_kernig');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Fever');
}
function write_ASSPEC_SEX() {
	var str=[], title=[];
	title[str.length] = 'associated trauma -';
	str[str.length] = getTXelem('ASSPEC_SEX_trauma');
	title[str.length] = 'evidence preservation -';
	str[str.length] = getTXelem('ASSPEC_SEX_evidence');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Sex assault');
}
function write_ASSPEC_ALLERGIC() {
	var str=[], title=[];
	str[str.length] = getRBelem('ASSPEC_ALLERGY_hives');
	str[str.length] = getRBelem('ASSPEC_ALLERGY_red');
	str[str.length] = getRBelem('ASSPEC_ALLERGY_angio');
	str[str.length] = getRBelem('ASSPEC_ALLERGY_rhino');
	title[str.length] = 'cause -';
	str[str.length] = getTXelem('ASSPEC_ALLERGY_cause');
	title[str.length] = 'history of similar events -';
	str[str.length] = getTXelem('ASSPEC_ALLERGY_history');
	write_ASSPEC_content(str, title);
	setUsage('Asspec', 'Allergy');
}






function writeAss() {
	
	setCHART('A');
	
	addTo("A: ");
	var hstr = initCap(getTXelem('txtASSESS'));
	var str1 = getRBelem('rbASSESS_severity');
	if (notBlank(hstr)) {
		addToCHART('Field diagnosis: ');
		addTo(hstr);
		addPeriod();
		setUsage('Assessment', 'Assessment');
	}
	if (notBlank(str1)) {
		addTo('Severity: ' + str1);
		addPeriod();
		setUsage('Assessment', 'Assessment');
	}
	addReturn();
	addReturn();
}
function writePlan() {
	
	setCHART('R');
	
	addTo("P: ");
	planCards.write();
}

// --------------------- W R I T E   P L A N   P R O C E D U R E S  ---------------------------------------------
// 1) Response, Arrival, EKG
// 2) 1023: Response
// 3) 1023: Response - code2 from quarters.
// 4) Response - code2 from quarters.
//
// cWORD indicates title, 1 above
// cSENT indicates a full sentence of descriptions, 2, 3 & 4 above

// RESPONSE
function writePlanResponse(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var hstr = '';
	var str1 = '';
	
	setCHART('R');
	
	// TIME
	hstr = getTXelem('txtPlanRespTime' + idnum);
	if (notBlank(hstr)) {
		addTo(hstr + ': Response');
		content = cSENT;
	} else {
		addTo('Response');
		content = cWORD;
	}
	
	// XPORT code
	hstr = getDLelem('ddlPlanResponseCode' + idnum);
	if (notBlank(hstr)) {
		addTo(' - ' + hstr);
		content = cSENT;
	}
	
	// From Quarters
	hstr = getCBelem('cbPlanRespQtrs' + idnum);
	str1 = getTXelem('txtPlanRespFrom' + idnum);
	if (notBlank(hstr)) {
		if (content === cSENT) { 
			addTo(' '); 
		} else {
			addTo(' - ');
		}
		addTo('from ' + hstr);
		prevTxt = true;
		content = cSENT;
	}
	// Responding from
	if (notBlank(str1)) {
		if (content === cSENT) { 
			if (!prevTxt) { addTo(' '); }
		} else {
			addTo(' - ');
		}
		if (prevTxt) { addComma(); }
		if (!prevTxt) { addTo('from '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	if (content === cSENT) { addPeriod(); }
	
	// set word or sentence type at beginning of this procedure
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Response');
	return content;
}

//ARRIVAL
function writePlanArrival(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanArriveTime' + idnum);
	var str0 = getTXelem('txtPlanArrivePtContact' + idnum);
	var str1 = getCBelem('cbPlanArriveStage' + idnum);
	var str2 = getTXelem('txtPlanArriveLocation' + idnum);
	var str3 = getTXelem('txtPlanArriveClear' + idnum);
	var str4 = getTXelem('txtPlanArriveNote' + idnum);
	var str5 = getCBelem('cbPlanArrivePPE' + idnum);
	var str6 = getTXelem('txtPlanArrivePPE' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Arrival');
		content = cSENT;
	} else {
		addTo('Arrival');
		content = cWORD;
	}

	// Donned PPE
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}

	// PPE description
	if (notBlank(str6)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('PPE: ' + str6);
		prevTxt = true;
		content = cSENT;
	}

	// pt contact time
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('pt contact at ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// staged
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// stage location
	if (notBlank(str2)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('at ' + str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// staging cleared
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('cleared by ' + str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Arrival');
	return content;
}

// EXAM
function writePlanExam(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanExamTime' + idnum);
	var str0 = getCBelem('cblPlanAssessABC' + idnum);
	var str1 = getCBelem('cblPlanAssessPE' + idnum);
	var str2 = getCBelem('cblPlanAssessHX' + idnum);
	var str3 = getCBelem('cblPlanAssess6' + idnum);
	var str4 = getCBelem('cblPlanAssessMask' + idnum);
	var str5 = getTXelem('txtPlanAssessResults' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Exam');
		content = cSENT;
	} else {
		addTo('Exam');
		content = cWORD;
	}
	
	// ABC's
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}

	// Initial exam
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}

	// Masked Patient
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}

	// Physical Exam
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}

	// History
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}

	// Comment
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Exam');
	return content;
}

//VITAL SIGNS
function writePlanVitals(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanVitalsTime' + idnum);
	var str0 = getTXelem('txtPlanVitalsHR' + idnum);
	var str1 = getRBelem('rblPlanVitalsRegular' + idnum);
	var str2 = getTXelem('txtPlanVitalsBP' + idnum);
	var str3 = getTXelem('txtPlanVitalsRR' + idnum);
	var str4 = getTXelem('txtPlanVitalsSP' + idnum);
	var str5 = getCBelem('cbPlanVitalsSPRA' + idnum);
	var str6 = getTXelem('txtPlanVitalsO2' + idnum);
	var str7 = getTXelem('txtPlanVitalsBS' + idnum);
	var str8 = getTXelem('txtPlanVitalsCO' + idnum);
	var str9 = getTXelem('txtPlanVitalsTemp' + idnum);
	var str10 = getDLelem('ddlPlanVitalsPosition' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Vital Signs');
		content = cSENT;
	} else {
		addTo('Vital Signs');
		content = cWORD;
	}
	
	// POSITION
	if (notBlank(str10)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Position: ' + str10);
		prevTxt = true;
		content = cSENT;
	}
	
	// HR
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('HR: ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// irregular
	if (notBlank(str1)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// BP
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('BP: ' + str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// RR
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('RR: ' + str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// SpO2
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('SpO2: ' + str4 + '%');
		prevTxt = true;
		content = cSENT;
	}
	
	// Room Air
	if (notBlank(str5)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('on ' + str5);
		prevTxt = true;
		content = cSENT;
	}
	
	// O2
	if (notBlank(str6)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('on ' + str6 +'lpm O2');
		prevTxt = true;
		content = cSENT;
	}
	
	// Lung sounds
	if (notBlank(str7)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Lung sounds: ' + str7);
		prevTxt = true;
		content = cSENT;
	}
	
	// SpCO
	if (notBlank(str8)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('SpCO: ' + str8 + '%');
		prevTxt = true;
		content = cSENT;
	}
	
	// Temperature
	if (notBlank(str9)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Temp: ' + str9);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Vitals');
	return content;
}

// GCS
function writePlanGCS(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanGCSTime' + idnum);
	var str0 = getDLelem('ddlPlanGCSeye_adult' + idnum);
	var str1 = getDLelem('ddlPlanGCSverbal_adult' + idnum);
	var str2 = getDLelem('ddlPlanGCSmotor_adult' + idnum);
	var gcstype = getRBelem('rbPlanGCStype' + idnum);
	if (gcstype === 'infant') {
		str0 = getDLelem('ddlPlanGCSeye_infant' + idnum);
		str1 = getDLelem('ddlPlanGCSverbal_infant' + idnum);
		str2 = getDLelem('ddlPlanGCSmotor_infant' + idnum);
	}
	var score = sum_GCS(idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': GCS');
		content = cSENT;
	} else {
		addTo('GCS');
		content = cWORD;
	}
	
	if (score > 0) {
		addTo(' - ' + score);
		prevTxt = true;
		content = cSENT;
	
		if (score !== 15) {
			// eye 
			if (notBlank(str0)) {
				if(prevTxt) { addComma(); } else { addTo(' - '); }
				addTo('Eye opening: ' + str0);
				prevTxt = true;
				content = cSENT;
			}
			
			// verbal
			if (notBlank(str1)) {
				if(prevTxt) { addSemi(); } else { addTo(' - '); }
				addTo('Verbal response: ' + str1);
				prevTxt = true;
				content = cSENT;
			}
			
			// motor
			if (notBlank(str2)) {
				if(prevTxt) { addSemi(); } else { addTo(' - '); }
				addTo('Motor response: ' + str2);
				prevTxt = true;
				content = cSENT;
			}
		}
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'GCS');
	return content;
}

// O2
function writePlanO2(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanO2Time' + idnum);
	var str0 = getTXelem('txtPlanO2LPM' + idnum);
	var str1 = getRBelem('rblPlanO2Type' + idnum);
	var str2 = getRBelem('rblPlanO2CPAP' + idnum);
	var str3 = getTXelem('txtPlanO2Results' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': O2');
		content = cSENT;
	} else {
		addTo('O2');
		content = cWORD;
	}
	
	// LPM 
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0 + ' lpm');
		prevTxt = true;
		content = cSENT;
	}
	
	// type
	if (notBlank(str1)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// CPAP
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('CPAP size: ' + str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'O2');
	return content;
}

// IV/IO
function writePlanIV(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanIVTime' + idnum);
	var str0 = getRBelem('rblPlanIVType' + idnum);
	var str1 = getDLelem('ddlPlanIVFluid' + idnum);
	var str2 = getTXelem('txtPlanIVAmt' + idnum);
	var str3 = getRBelem('rblPlanIVRate' + idnum);
	var str4 = getTXelem('txtPlanIVRate' + idnum);
	var str5 = getDLelem('ddlPlanIVMacro' + idnum);
	var str6 = getDLelem('ddlPlanIVCatheter' + idnum);
	var str7 = getDLelem('ddlPlanIVSite' + idnum);
	var str8 = getTXelem('txtPlanIVSite' + idnum);
	var str9 = getDLelem('ddlPlanIVAttempts' + idnum);
	var str10 = getRBelem('rblPlanIVSuccess' + idnum);
	var str11 = getTXelem('txtPlanIVResults' + idnum);
	
	setCHART('R');
	
	if (str0 === '') { str0 = 'IV/IO'; } // set title to IV/IO if none was chosen
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + str0);
		content = cSENT;
	} else {
		addTo(str0);
		content = cWORD;
	}
	
	// fluid 
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// amount 
	if (notBlank(str2)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// rate 
	if (notBlank(str3)) {
		if (str3 !== ' gtts') {
			if(prevTxt) { addSpace(); } else { addTo(' - '); }
			addTo(str3);
			prevTxt = true;
			content = cSENT;
		} else {
			// drip rate
			if (notBlank(str4)) {
				if(prevTxt) { addComma(); } else { addTo(' - '); }
				addTo(str4 + 'gtts');
				prevTxt = true;
				content = cSENT;
			}
			// drip size
			if (notBlank(str5)) {
				if(prevTxt) { addComma(); } else { addTo(' - '); }
				addTo(str5);
				prevTxt = true;
				content = cSENT;
			}
		}
	}
	
	// catheter 
	if (notBlank(str6)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str6);
		prevTxt = true;
		content = cSENT;
	}
	
	// location 
	if (notBlank(str7)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str7);
		prevTxt = true;
		content = cSENT;
	}
	
	// location other 
	if (notBlank(str8)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str8);
		prevTxt = true;
		content = cSENT;
	}
	
	// attempts 
	if (notBlank(str9)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str9 + ' attempt');
		if (str9 > 1) { addTo('s'); }
		prevTxt = true;
		content = cSENT;
	}
	
	// success 
	if (notBlank(str10)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str10);
		prevTxt = true;
		content = cSENT;
	}
	
	// note 
	if (notBlank(str11)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str11);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'IV/IO');
	return content;
}

//Blood sugar
function writePlanBSugar(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanBSugarTime' + idnum);
	var str0 = getRBelem('rblPlanBSugarType' + idnum);
	var str1 = getTXelem('txtPlanBSugarReading' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Blood Glucose');
		content = cSENT;
	} else {
		addTo('Blood Glucose');
		content = cWORD;
	}
	
	// reading 
	if (notBlank(str1)) {
		if (str1 !== 'mg/dL') {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo(str1);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	// type 
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('from the ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Blood Glucose');
	return content;
}

//Pain scale
function writePlanPain(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanPainTime' + idnum);
	var str1 = getRBelem('rblPlanPain' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Pain Scale');
		content = cSENT;
	} else {
		addTo('Pain Scale');
		content = cWORD;
	}
	
	// level 
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1 + '/10');
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Pain Scale');
	return content;
}

//Cranial Nerve Exam
function writePlanCNE(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanCNETime' + idnum);
	var str0 = getCBelem('cbPlanCNEintact' + idnum);
	var str1 = getRBelem('rbPlanCNE1' + idnum);
	var str2 = getRBelem('rbPlanCNE2' + idnum);
	var str3 = getRBelem('rbPlanCNE3' + idnum);
	var str4 = getRBelem('rbPlanCNE4' + idnum);
	var str5 = getRBelem('rbPlanCNE5' + idnum);
	var str6 = getRBelem('rbPlanCNE6' + idnum);
	var str7 = getRBelem('rbPlanCNE7' + idnum);
	var str8 = getRBelem('rbPlanCNE8' + idnum);
	var str9 = getRBelem('rbPlanCNE9' + idnum);
	var str10 = getRBelem('rbPlanCNE10' + idnum);
	var str11 = getTXelem('txtPlanCNEResults' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Cranial Nerve Exam');
		content = cSENT;
	} else {
		addTo('Cranial Nerve Exam');
		content = cWORD;
	}
	
	// grossly intact
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	} else {
		if (notBlank(str1)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('I-smell: ' + str1);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str2)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('II-visual acuity: ' + str2);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str3)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('II,III-pupils: ' + str3);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str4)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('III,IV,V-eyes: ' + str4);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str5)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('V-facial: ' + str5);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str6)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('VII-smile: ' + str6);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str7)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('VIII-hearing: ' + str7);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str8)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('IX,X-swallow,cough: ' + str8);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str9)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('XI-shoulders: ' + str9);
			prevTxt = true;
			content = cSENT;
		}
		if (notBlank(str10)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('XII-tongue: ' + str10);
			prevTxt = true;
			content = cSENT;
		}
	}
	if (notBlank(str11)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str11);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Pain Scale');
	return content;
}

//CPR
function writePlanCPR(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanCPRTime' + idnum);
	var str0 = getCBelem('cbPlanCPRInProgress' + idnum);
	var str1 = getDLelem('ddlPlanCPRRate' + idnum);
	var str2 = getRBelem('rbPlanCPRStart' + idnum);
	var str3 = getTXelem('txtPlanCPRResults' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': CPR');
		content = cSENT;
	} else {
		addTo('CPR');
		content = cWORD;
	}
	
	// in progress 
	if (notBlank(str0)) {
		if (notBlank(str1)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo(str1);
			prevTxt = true;
			content = cSENT;
		}
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// started or stopped
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'CPR');
	return content;
}

//Capnography
function writePlanCap(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanCapTime' + idnum);
	var str0 = getRBelem('rblPlanCapType' + idnum);
	var str1 = getTXelem('txtPlanCapValue' + idnum);
	var str2 = getTXelem('txtPlanCapRR' + idnum);
	var str3 = getDLelem('ddlPlanCapWave' + idnum);
	var str4 = getTXelem('txtPlanCapWaveOther' + idnum);
	
	setCHART('R');
	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Capnography');
		content = cSENT;
	} else {
		addTo('Capnography');
		content = cWORD;
	}
	
	// value
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1 + ' mmHg');
		prevTxt = true;
		content = cSENT;
	}
	
	// type
	if (notBlank(str0)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('via ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// RR
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('RR: ' + str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// waveform
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// waveform other
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Capnography');
	return content;
}

//Drug
function writePlanDrug(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanDrugTime' + idnum);
	var str0 = getDLelem('ddlPlanDrugBasicDrug' + idnum);
	var str1 = getDLelem('ddlPlanDrugAdvDrug' + idnum);
	var str2 = getDLelem('ddlPlanDrugICUDrug' + idnum);
	var str3 = getTXelem('txtPlanDrugOther' + idnum);
	var str4 = getTXelem('txtPlanDrugDose' + idnum);
	var str5 = getDLelem('ddlPlanDrugRoute' + idnum);
	var str6 = getTXelem('txtPlanDrugResults' + idnum);
	
	setCHART('R');
	
	// name of medication
	var strTitle = 'Medication';
	if (notBlank(str0)) { strTitle = str0.toUpperCase(); }
	if (notBlank(str1)) { strTitle = str1.toUpperCase(); }
	if (notBlank(str2)) { strTitle = str2.toUpperCase(); }
	if (notBlank(str3)) { strTitle = str3.toUpperCase(); }
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + strTitle);
		content = cSENT;
	} else {
		addTo(strTitle);
		content = cWORD;
	}
	
	// dosage
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	// route
	if (notBlank(str5)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str6)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str6);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Drug');
	return content;
}

// AIRWAY OPA/NPA
function writePlanOPA(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanAirwayTime' + idnum);
	var str0 = getRBelem('rbPlanAirway' + idnum);
	var str1 = getTXelem('txtPlanAirwayOPA' + idnum);
	var str2 = getTXelem('txtPlanAirwayNPA' + idnum);
	var str3 = getDLelem('ddlPlanAirwayNPApos' + idnum);
	var str4 = getTXelem('txtPlanAirwayResults' + idnum);
	
	setCHART('R');
	
	// type
	var strTitle = 'Airway OPA/NPA';
	if (notBlank(str0)) { strTitle = 'Airway ' + str0; }
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + strTitle);
		content = cSENT;
	} else {
		addTo(strTitle);
		content = cWORD;
	}
	
	// size
	if (str0 === 'OPA') {
		if (notBlank(str1)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo(str1);
			prevTxt = true;
			content = cSENT;
		}
	}
	if (str0 === 'NPA') {
		if (notBlank(str2)) {
				if(prevTxt) { addComma(); } else { addTo(' - '); }
				addTo(str2);
				prevTxt = true;
				content = cSENT;
			}
		// NPA pos
		if (notBlank(str3)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo(str3);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	// note
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'OPA/NPA');
	return content;
}

//AIRWAY OETT/NETT
function writePlanETT(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanETTTime' + idnum);
	var str0 = getRBelem('rblPlanETTType' + idnum);
	var str1 = getTXelem('txtPlanETTSize' + idnum);
	var str2 = getTXelem('txtPlanETTDepth' + idnum);
	var str3 = getTXelem('txtPlanETTBlade' + idnum);
	var str4 = getCBelem('cblPlanETTAddB' + idnum);
	var str5 = getCBelem('cblPlanETTAddS' + idnum);
	var str6 = getTXelem('txtPlanETTSPpre' + idnum);
	var str7 = getTXelem('txtPlanETTSPpost' + idnum);
	var str8 = getDLelem('ddlPlanETTAttempts' + idnum);
	var str9 = getRBelem('rblPlanETTSuccess' + idnum);
	var str10 = getDLelem('ddlPlanETTVerifychords' + idnum);
	var str11 = getDLelem('ddlPlanETTVerifyEDD' + idnum);
	var str12 = getDLelem('ddlPlanETTVerifyCap' + idnum);
	var str13 = getDLelem('ddlPlanETTVerifylung' + idnum);
	var str14 = getDLelem('ddlPlanETTVerifygastric' + idnum);
	var str15 = getDLelem('ddlPlanETTVerifychest' + idnum);
	var str16 = getTXelem('txtPlanETTResults' + idnum);
	
	setCHART('R');
	
	// type
	var strTitle = 'Airway OETT/NETT';
	if (notBlank(str0)) { strTitle = 'Airway ' + str0; }
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + strTitle);
		content = cSENT;
	} else {
		addTo(strTitle);
		content = cWORD;
	}
	
	// size
	if (notBlank(str1) && str1 !== 'mm') {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Size: ' + str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// depth
	if (notBlank(str2) && str2 !== 'cm') {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Depth: ' + str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// blade
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Blade: ' + str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// BURP
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	// secured
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	
	// spo2 pre
	if (notBlank(str6)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('pre SpO2: ' + str6 + '%');
		prevTxt = true;
		content = cSENT;
	}
	
	// spo2 post
	if (notBlank(str7)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('post SpO2: ' + str7 + '%');
		prevTxt = true;
		content = cSENT;
	}
	
	// attempts
	if (notBlank(str8)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str8 + ' attempt');
		if (str8 > 1) { addTo('s'); }
		prevTxt = true;
		content = cSENT;
	}
	
	// success
	if (notBlank(str9)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str9);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify chords
	if (notBlank(str10)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str10);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify edd
	if (notBlank(str11)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str11);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify capnography
	if (notBlank(str12)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str12);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify lung
	if (notBlank(str13)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str13);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify gastric
	if (notBlank(str14)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str14);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify chest
	if (notBlank(str15)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str15);
		prevTxt = true;
		content = cSENT;
	}
	
	// notes
	if (notBlank(str16)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str16);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'ETT');
	return content;
}

//AIRWAY LMA
function writePlanLMA(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanLMATime' + idnum);
	var str0 = getTXelem('txtPlanLMAdevice' + idnum);
	var str1 = getTXelem('txtPlanLMAsize' + idnum);
	var str2 = getTXelem('txtPlanLMAcomment' + idnum);
	var str5 = getCBelem('cbPlanLMAsecured' + idnum);
	var str6 = getTXelem('txtPlanLMASPpre' + idnum);
	var str7 = getTXelem('txtPlanLMASPpost' + idnum);
	var str8 = getDLelem('ddlPlanLMAAttempts' + idnum);
	var str9 = getRBelem('rblPlanLMASuccess' + idnum);
	var str12 = getDLelem('ddlPlanLMAVerifyCap' + idnum);
	var str13 = getDLelem('ddlPlanLMAVerifylung' + idnum);
	var str14 = getDLelem('ddlPlanLMAVerifygastric' + idnum);
	var str15 = getDLelem('ddlPlanLMAVerifychest' + idnum);
	var str16 = getTXelem('txtPlanLMAResults' + idnum);
	
	setCHART('R');
	
	// name of device
	var strTitle = 'Airway Laryngeal';
	if (notBlank(str0)) { strTitle = initCap(str0); }
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + strTitle);
		content = cSENT;
	} else {
		addTo(strTitle);
		content = cWORD;
	}
	
	// size
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Size: ' + str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// comment
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// secured
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	
	// spo2 pre
	if (notBlank(str6)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('pre SpO2: ' + str6 + '%');
		prevTxt = true;
		content = cSENT;
	}
	
	// spo2 post
	if (notBlank(str7)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('post SpO2: ' + str7 + '%');
		prevTxt = true;
		content = cSENT;
	}
	
	// attempts
	if (notBlank(str8)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str8 + ' attempt');
		if (str8 > 1) { addTo('s'); }
		prevTxt = true;
		content = cSENT;
	}
	
	// success
	if (notBlank(str9)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str9);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify capnography
	if (notBlank(str12)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str12);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify lung
	if (notBlank(str13)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str13);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify gastric
	if (notBlank(str14)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str14);
		prevTxt = true;
		content = cSENT;
	}
	
	// verify chest
	if (notBlank(str15)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str15);
		prevTxt = true;
		content = cSENT;
	}
	
	// notes
	if (notBlank(str16)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str16);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'LMA');
	return content;
}

//AIRWAY Cric
function writePlanCric(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanCricTime' + idnum);
	var str0 = getTXelem('txtPlanCricNote' + idnum);
	
	setCHART('R');

	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Airway Cric');
		content = cSENT;
	} else {
		addTo('Airway Cric');
		content = cWORD;
	}
	
	// note
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Cric');
	return content;
}

// AIRWAY Check
function writePlanAck(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanACheckTime' + idnum);
	var str0 = getTXelem('txtPlanACheckLung' + idnum);
	var str1 = getDLelem('ddlPlanACheckGastric' + idnum);
	var str2 = getTXelem('txtPlanACheckCap' + idnum);
	var str3 = getCBelem('cbPlanACheckCap' + idnum);
	var str4 = getTXelem('txtPlanACheckResults' + idnum);
	
	setCHART('R');

	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Airway Check');
		content = cSENT;
	} else {
		addTo('Airway Check');
		content = cWORD;
	}
	
	// lung sounds
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Lung sounds: ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// gastric
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// co2
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('CO2: ' + str2 + ' mmHg');
		prevTxt = true;
		content = cSENT;
	}
	
	// co2 waveform
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Airway Check');
	return content;
}

//SUCTION
function writePlanSuc(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanSuctionTime' + idnum);
	var str0 = getRBelem('rblPlanSuctionType' + idnum);
	var str1 = getTXelem('txtPlanSuctionSize' + idnum);
	var str2 = getTXelem('txtPlanSuctionResults' + idnum);
	
	setCHART('R');

	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Suction');
		content = cSENT;
	} else {
		addTo('Suction');
		content = cWORD;
	}
	
	// type
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Type: ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// size
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Size: ' + str1 + ' fr');
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Suction');
	return content;
}

//ORDERS
function writePlanOrd(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanOrdersTime' + idnum);
	var str0 = getTXelem('txtPlanOrdersHospital' + idnum);
	var str1 = getTXelem('txtPlanOrdersMD' + idnum);
	var str2 = getTXelem('txtPlanOrdersOrders' + idnum);
	
	setCHART('R');

	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Orders');
		content = cSENT;
	} else {
		addTo('Orders');
		content = cWORD;
	}
	
	// MD
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Given by ' + str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// facility
	if (notBlank(str0)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('from ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Orders');
	return content;
}

// EKG
function writePlanEKG(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanEKGTime' + idnum);
	var str0 = getRBelem('rblPlanEKGType' + idnum);
	var str1 = getDLtextelem('ddlPlanEKGRhythm' + idnum);
	var str2 = getTXelem('txtPlanEKGOther' + idnum);
	
	setCHART('R');

	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': EKG');
		content = cSENT;
	} else {
		addTo('EKG');
		content = cWORD;
	}
	
	// type
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('via ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// rhythm
	if (notBlank(str1) && str1 !== 'Choose') {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'EKG');
	return content;
}

//EKG FAX
function writePlanFax(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanFaxTime' + idnum);
	var str0 = getDLelem('ddlPlanFaxHospital' + idnum);
	var str1 = getCBelem('cbPlanFaxConfirmed' + idnum);
	
	setCHART('R');

	
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': EKG Sent');
		content = cSENT;
	} else {
		addTo('EKG Sent');
		content = cWORD;
	}
  
		// facility
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('sent to ' + str0);
		prevTxt = true;
		content = cSENT;	content = cSENT;
      
	}
	
	// received
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'EKG Fax');
	return content;
}

//DEFIB/PACING
function writePlanDefib(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanDefibTime' + idnum);
	var str0 = getRBelem('rblPlanDefibType' + idnum);
	var str1 = getTXelem('txtPlanDefibJoules' + idnum);
	var str2 = getTXelem('txtPlanDefibmA' + idnum);
	var str3 = getTXelem('txtPlanDefibRate' + idnum);
	var str4 = getCBelem('cbPlanDefibStop' + idnum);
	var str5 = getTXelem('txtPlanBandageNote' + idnum);
	
	setCHART('R');

	// type
	var strTitle = 'Defib / Pacing';
	if (notBlank(str0)) { strTitle = initCap(str0); }
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + strTitle);
		content = cSENT;
	} else {
		addTo(strTitle);
		content = cWORD;
	}
	
	// joules
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1 + ' Joules');
		prevTxt = true;
		content = cSENT;
	}
	
	// ma
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2 + ' ma');
		prevTxt = true;
		content = cSENT;
	}
	
	// rate
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3 + ' bpm');
		prevTxt = true;
		content = cSENT;
	}
	
	// stop
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Defib');
	return content;
}

//BANDAGE
function writePlanBand(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanBandageTime' + idnum);
	var str0 = getTXelem('txtPlanDefibResults' + idnum);
	
	setCHART('R');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Bandage');
		content = cSENT;
	} else {
		addTo('Bandage');
		content = cWORD;
	}
	
	// note
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Bandage');
	return content;
}

//SPLINT
function writePlanSplint(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanSplintTime' + idnum);
	var str0 = getTXelem('txtPlanSplintNote' + idnum);
	
	setCHART('R');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Splint');
		content = cSENT;
	} else {
		addTo('Splint');
		content = cWORD;
	}
	
	// note
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Splint');
	return content;
}

//EXTRICATION
function writePlanExtr(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanExtricationTime' + idnum);
	var str0 = getTXelem('txtPlanExtricationNote' + idnum);
	
	setCHART('R');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Extrication');
		content = cSENT;
	} else {
		addTo('Extrication');
		content = cWORD;
	}
	
	// note
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Extrication');
	return content;
}

//SPINAL
function writePlanSpinal(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanSpinalTime' + idnum);
	var str0 = getCBelem('cblPlanSpinalPartsM' + idnum);
	var str1 = getCBelem('cblPlanSpinalPartsC' + idnum);
	var str2 = getRBelem('rbPlanSpinalPartsCsize' + idnum);
	var str3 = getCBelem('cblPlanSpinalPartsB' + idnum);
	var str4 = getCBelem('cblPlanSpinalPartsMT' + idnum);
	var str5 = getCBelem('cblPlanSpinalPartsS' + idnum);
	var str6 = getCBelem('cblPlanSpinalPartsBL' + idnum);
	var str7 = getCBelem('cblPlanSpinalPartsT' + idnum);
	var str8 = getCBelem('cblPlanSpinalPartsCMS' + idnum);
	var str9 = getTXelem('txtPlanSpinalNote' + idnum);
	
	setCHART('R');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Spinal Immobilization');
		content = cSENT;
	} else {
		addTo('Spinal Immobilization');
		content = cWORD;
	}
	
	// manual
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// collar and size
	if (notBlank(str2) && notBlank(str1)) { // collar and size
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2 + ' ' + str1);
		prevTxt = true;
		content = cSENT;
	} else {
		if (notBlank(str2) && !notBlank(str1)) { // size, no collar
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo(str2 + ' collar');
			prevTxt = true;
			content = cSENT;
		} else {
			if (notBlank(str1)) { // collar
				if(prevTxt) { addComma(); } else { addTo(' - '); }
				addTo(str1);
				prevTxt = true;
				content = cSENT;
			}
			if (notBlank(str2)) { // size
				if(prevTxt) { addComma(); } else { addTo(' - '); }
				addTo(str2);
				prevTxt = true;
				content = cSENT;
			}
		}
	}
	
	// board
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// mattress
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	// straps
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	
	// blocks
	if (notBlank(str6)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str6);
		prevTxt = true;
		content = cSENT;
	}
	
	// tape
	if (notBlank(str7)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str7);
		prevTxt = true;
		content = cSENT;
	}
	
	// cms
	if (notBlank(str8)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str8);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str9)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str9);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Spinal');
	return content;
}

//TO COT
function writePlanCot(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanCotTime' + idnum);
	var str0 = getDLelem('ddlPlanCotWalk' + idnum);
	var str1 = getTXelem('txtPlanCotCarryNote' + idnum);
	var str2 = getDLelem('ddlPlanCotCarriers' + idnum);
	var str3 = getTXelem('txtPlanCotObstacles' + idnum);
	var str4 = getDLelem('ddlPlanCotPosition' + idnum);
	var str5 = getTXelem('txtPlanCotNote' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': To Cot');
		content = cSENT;
	} else {
		addTo('To Cot');
		content = cWORD;
	}
	
	// mobility
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// how carried
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// carriers
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2 + ' carriers');
		prevTxt = true;
		content = cSENT;
	}
	
	// obstacles
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// position
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Position on cot: ' + str4);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'To Cot');
	return content;
}

//REFUSAL
function writePlanRefusal(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanRefusalTime' + idnum);
	var str0 = getRBelem('rblPlanRefusalVia' + idnum);
	var str1 = getRBelem('rblPlanRefusalContact' + idnum);
	var str9 = getTXelem('txtPlanRefusalContact' + idnum);
	var str2 = getTXelem('txtPlanRefusalHospital' + idnum);
	var str3 = getRBelem('rblPlanRefusalAccept' + idnum);
	var str4b = getCBelem('cbPlanRefusalCapable' + idnum);
	var str4 = getCBelem('cbPlanRefusalSigned' + idnum);
	var str5 = getCBelem('cbPlanRefusalGuardian' + idnum);
	var str6 = getCBelem('cbPlanRefusalRefused' + idnum);
	var str7 = getCBelem('cbPlanRefusalReceipt' + idnum);
	var str8 = getTXelem('txtPlanRefusalNote' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Refusal');
		content = cSENT;
	} else {
		addTo('Refusal');
		content = cWORD;
	}
	
	// via
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// contact
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('from ' + str1);
		prevTxt = true;
		content = cSENT;
	}
	if (notBlank(str9) && notBlank(str1)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo(str9);
		prevTxt = true;
		content = cSENT;
	} else {
		if (notBlank(str9)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('from ' + str9);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	// hospital
	if (notBlank(str2) && (notBlank(str1) || notBlank(str9))) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('at ' + str2);
		prevTxt = true;
		content = cSENT;
	} else {
		if (notBlank(str2)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('from ' + str2);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	// accepted
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}

	// capable
	if (notBlank(str4b)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4b);
		prevTxt = true;
		content = cSENT;
	}
	// signed
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	if (notBlank(str5)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str5);
		prevTxt = true;
		content = cSENT;
	}
	if (notBlank(str6)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str6);
		prevTxt = true;
		content = cSENT;
	}
	if (notBlank(str7)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str7);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str8)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str8);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Refusal');
	return content;
}

//PT ADVISED
function writePlanAdvised(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanAdvisedTime' + idnum);
	var str0 = getTXelem('txtPlanAdvisedNote' + idnum);
	
	setCHART('R');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Pt Advised');
		content = cSENT;
	} else {
		addTo('Pt Advised');
		content = cWORD;
	}
	
	// note
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Pt Advised');
	return content;
}

//AMBULANCE
function writePlanAmb(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanAmbulanceTime' + idnum);
	var str0 = getTXelem('txtPlanAmbulanceNote' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Ambulance');
		content = cSENT;
	} else {
		addTo('Ambulance');
		content = cWORD;
	}
	
	// note
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Ambulance');
	return content;
}

//TERMINATE CARE
function writePlanTerm(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanTermTime' + idnum);
	var str0 = getCBelem('cbPlanTermProt' + idnum);
	var str1 = getTXelem('txtPlanTermMD' + idnum);
	var str2 = getTXelem('txtPlanTermFacility' + idnum);
	var str3 = getCBelem('cbPlanTermDNR' + idnum);
	var str4 = getTXelem('txtPlanTermNote' + idnum);
	
	setCHART('R');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Terminate Care');
		content = cSENT;
	} else {
		addTo('Terminate Care');
		content = cWORD;
	}
	
	// per protocol
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// MD
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('from MD ' + str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// facility
	if (notBlank(str2) && notBlank(str1)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('at ' + str2);
		prevTxt = true;
		content = cSENT;
	} else {
		if (notBlank(str2)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('from ' + str2);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	// DNR
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// NOTE
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Terminate Care');
	return content;
}

//TRANSPORT
function writePlanXport(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanXportTime' + idnum);
	var str0 = getDLelem('ddlPlanXportCode' + idnum);
	var str1 = getTXelem('ddlPlanXportVia' + idnum);
	var str2 = getTXelem('txtPlanXportHospital' + idnum);
	var str3 = getTXelem('txtPlanXportDiverted' + idnum);
	var str4 = getTXelem('txtPlanXportNote' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Transport');
		content = cSENT;
	} else {
		addTo('Transport');
		content = cWORD;
	}
	
	// Code
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// Via
	if (notBlank(str1) && notBlank(str0)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo('via ' + str1);
		prevTxt = true;
		content = cSENT;
	} else {
		if (notBlank(str1)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo('via ' + str1);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	// hospital
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('to ' + str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// diverted
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('diverted to ' + str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// note
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Transport');
	return content;
}

//RADIO REPORT
function writePlanRadio(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanRadioTime' + idnum);
	var str0 = getRBelem('rblPlanRadioVia' + idnum);
	var str1 = getRBelem('rblPlanRadioContact' + idnum);
	var str2 = getTXelem('txtPlanRadioContact' + idnum);
	var str3 = getTXelem('txtPlanRadioNote' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Radio Report');
		content = cSENT;
	} else {
		addTo('Radio Report');
		content = cWORD;
	}
	
	// via
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// MD, RN
	if (notBlank(str1)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// name
	if (notBlank(str2) && notBlank(str1)) {
		if(prevTxt) { addSpace(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	} else {
		if (notBlank(str2)) {
			if(prevTxt) { addSpace(); } else { addTo(' - '); }
			addTo('to ' + str2);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	// note
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str3);
		prevTxt = true;
		content = cSENT;
	}

	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Radio Report');
	return content;
}

//DESTINATION
function writePlanDest(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanDestTime' + idnum);
	var str0 = getTXelem('txtPlanDestRoom' + idnum);
	var str1 = getTXelem('txtPlanDestNote' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Destination');
		content = cSENT;
	} else {
		addTo('Destination');
		content = cWORD;
	}
	
	// Room
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo('Room # ' + str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// NOte
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Destination');
	return content;
}

//TRANSFER CARE
function writePlanXfer(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanXferTime' + idnum);
	var str0 = getCBelem('cblPlanXferWhoMD' + idnum);
	var str1 = getCBelem('cblPlanXferWhoRN' + idnum);
	var str2 = getTXelem('txtPlanXferOther' + idnum);
	var str3 = getRBelem('rbPlanXferCond' + idnum);
	var str4 = getTXelem('txtPlanXferNote' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': Transfer Care');
		content = cSENT;
	} else {
		addTo('Transfer Care');
		content = cWORD;
	}
	
	// MD
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		if ((notBlank(str0) || notBlank(str1) || notBlank(str2)) && !prevTxt) { addTo('to '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	//RN
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		if ((notBlank(str0) || notBlank(str1) || notBlank(str2)) && !prevTxt) { addTo('to '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// Other
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		if ((notBlank(str0) || notBlank(str1) || notBlank(str2)) && !prevTxt) { addTo('to '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	// Condition
	if (notBlank(str3)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo("pt's condition: " + str3);
		prevTxt = true;
		content = cSENT;
	}
	
	// NOte
	if (notBlank(str4)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str4);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'Transfer Care');
	return content;
}

//END OF CONTACT
function writePlanEnd(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanEndTime' + idnum);
	var str0 = getCBelem('cblPlanEndBISBis' + idnum);
	var str1 = getCBelem('cblPlanEndBISRem' + idnum);
	var str2 = getCBelem('cblPlanEndBISRpt' + idnum);
	
	setCHART('T');

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': CDS Reconciliation');
		content = cSENT;
	} else {
		addTo('CDS Reconciliation');
		content = cWORD;
	}
	
	// BIS
	if (notBlank(str0)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str0);
		prevTxt = true;
		content = cSENT;
	}
	
	// Remain
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	// Report
	if (notBlank(str2)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str2);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'End of contact');
	return content;
}

//OTHER
function writePlanOther(id, prevword) {
	var idnum = id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	var tstr = getTXelem('txtPlanOtherTime' + idnum);
	var str0 = getTXelem('txtPlanOtherName' + idnum);
	var str1 = getTXelem('txtPlanOtherNote' + idnum);

	// name
	var strTitle = 'Other';
	if (notBlank(str0)) { strTitle = initCap(str0); }
	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + strTitle);
		content = cSENT;
	} else {
		addTo(strTitle);
		content = cWORD;
	}
	
	// NOte
	if (notBlank(str1)) {
		if(prevTxt) { addComma(); } else { addTo(' - '); }
		addTo(str1);
		prevTxt = true;
		content = cSENT;
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'OTHER');
	return content;
}

//CUSTOM
//plan_data = data from the html plan card
//item_data = database data about the singular element
function writePlanCustom(plan_data, item_data, prevword) {
	var idnum = plan_data.id.slice(-4);
	var savedRptPos = savePos();
	var content = false; // set to cWORD, cSENT as appropriate, is returned at end
	var prevTxt = false;
	
	setCHART(item_data.chart);
	
	var tstr = getTXelem(plan_data.timeid);

	// TIME
	if (notBlank(tstr)) {
		addTo(tstr + ': ' + plan_data.name);
		content = cSENT;
	} else {
		addTo(plan_data.name);
		content = cWORD;
	}
	
	for (var i=0; i<item_data.elements.length; i++) {
		switch (item_data.elements[i].type) {
        case 'singletext' : str1 = writeCustomSingle(plan_data.name, item_data.elements[i], idnum, i+1); break;
        case 'multitext'  : str1 = writeCustomMulti(plan_data.name, item_data.elements[i], idnum, i+1); break;
        case 'radio'      : str1 = writeCustomRadio(plan_data.name, item_data.elements[i], idnum, i+1); break;
        case 'dropdown'   : str1 = writeCustomDropdown(plan_data.name, item_data.elements[i], idnum, i+1); break;
        case 'checkbox'   : str1 = writeCustomCheckbox(plan_data.name, item_data.elements[i], idnum, i+1); break;
        case 'label'      : str1 = writeCustomLabel(plan_data.name, item_data.elements[i], idnum, i+1); break;
        case 'titleonly'  : str1 = ''; break;
		}
		
		if (notBlank(str1)) {
			if(prevTxt) { addComma(); } else { addTo(' - '); }
			addTo(str1);
			prevTxt = true;
			content = cSENT;
		}
	}
	
	if (content === cSENT) { addPeriod(); }

	// create the beginning comma or return based on previous word or sentence
	planEndCardWrite(prevword, content, savedRptPos);
	setUsage('Plan', 'CUSTOM');
	return content;
}

//item_data = database data about the singular element
//idnum = plan card id number
//element_number = id number of the element within the plan card
function writeCustomSingle(plan_name, item_data, idnum, element_number) {
    //txtcstmTEST_ALL_Heart_rates1_00010001
	var itemid = 'txtcstm' + make_id_name(plan_name) + '_' + compress_space(item_data.name) + '1' + '_' + 
					num2str4(element_number) + idnum;
	var txtinput = getTXelem(itemid);
	var write_text = '';
	if (txtinput !== '') {
		if (item_data.name !== '') {
			write_text += item_data.name + ': ';
		}
		write_text += txtinput;
		if (item_data.afterlabel !== '') {
			write_text += ' ' + item_data.afterlabel;
		}
	}
	return write_text;
}
function writeCustomMulti(plan_name, item_data, idnum, element_number) {
	var itemid = 'txtcstm' + make_id_name(plan_name) + '_' + compress_space(item_data.name) + '1' + '_' + 
					num2str4(element_number) + idnum;
	var txtinput = getTXelem(itemid);
	var write_text = '';
	if (txtinput !== '') {
		if (item_data.name !== '') {
			write_text += item_data.name + ': ';
		}
		write_text += txtinput;
	}
	return write_text;
}
function writeCustomRadio(plan_name, item_data, idnum, element_number) {
	var itemid = 'rbcstm' + make_id_name(plan_name) + '_' + compress_space(item_data.name) + '1' + '_' + 
					num2str4(element_number) + idnum;
	var txtinput = getRBelem(itemid);
	var write_text = '';
	if (txtinput !== '') {
		if (item_data.name !== '') {
			write_text += item_data.name + ': ';
		}
		write_text += txtinput;
	}
	return write_text;
}
function writeCustomDropdown(plan_name, item_data, idnum, element_number) {
	var itemid = 'ddlcstm' + make_id_name(plan_name) + '_' + compress_space(item_data.name) + '1' + '_' + 
					num2str4(element_number) + idnum;
	var txtinput = getDLelem(itemid);
	var write_text = '';
	if (txtinput !== '') {
		if (item_data.name !== '') {
			write_text += item_data.name + ': ';
		}
		write_text += txtinput;
	}
	return write_text;
}
function writeCustomCheckbox(plan_name, item_data, idnum, element_number) {
	var itemid = '';
	var prev_text = false;
	var write_text = '';
	var write_text2 = '';
	for (var i=0; i<item_data.items.length; i++) {
		itemid = 'cblcstm' + make_id_name(plan_name) + '_' + compress_space(item_data.name) + '1' + '_'  + num2str4(i) + '_' + 
					num2str4(element_number) + idnum;
		var txtinput = getCBelem(itemid);
		if (txtinput !== '') {
			if (prev_text) { write_text2 += ', '; }
			write_text2 += txtinput;
			prev_text = true;
		}
	}
	if (item_data.name !== '' && write_text2 !== '') {
		write_text += item_data.name + ': ';
	}
	return write_text + write_text2;
}
function writeCustomLabel(plan_name, item_data, idnum, element_number) {
	return '';
}
function make_id_name (name) {
	return name.toUpperCase().split(' ').join('_');
}
function compress_space (name) {
	return name.split(' ').join('_');
}
function num2str4 (num) {
	if (num < 10)    { return  '000' + num.toString(); }
	if (num < 100)   { return   '00' + num.toString(); }
	if (num < 1000)  { return    '0' + num.toString(); }
	return num.toString();
};

function writeEnding() {
	setCHART('E');
	addReturn();
	addReturn();
	addReturn();
	addReturn();
	addToCHART(cRETURN);
	addToCHART(cRETURN);
	var str1 = getTXelem('endAuthor');
	var str2 = getTXelem('endTime');
	if (notBlank(str1)) {
		addTo('Report written by: ' + str1 + '  ' + str2);
	}
}






//-----------------------------------------------------------------------
//name: writeExam
//param: id: string with the ID of the section - HD = head
//		  title: all cap title - HEAD
//        natarr: array of objects of unnatural special handling and how to handle it - {name: Gag Reflex, positive: gag reflex intact, negative: no gag reflex}
//        unre: does unremarkable checkbox exists (does not in mental status)
//        specialarr: array of object for special handling (ie. negative of calm is not calm, instead of no calm
//return: none, adds directly to the report
//
//desc: write the report for the exam sections
//----------------------------------------------------------------------

function WriteExam (id, title) {
	this.id = id;
	this.title = title;
	this.unre = true;
	this.natarr = [];
	this.specialarr = [];
	this.natural = function (iname, ipositive, inegative) {
		this.natarr.push({name: iname, positive: ipositive, negative: inegative});
	};
	this.special = function (iname, ipositive, inegative) {
		this.specialarr.push({name: iname, positive: ipositive, negative: inegative});
	};
	this.setUnre = function (state) {
		this.unre = state;
	};
	this.write = function () {
		var prevTxt = false;
		var prevTxt2 = false;
		var unrechk = false;
		var hstr = '';
		var found = false;
		if (this.unre) { // if unremarkable checkbox exists
			hstr = getCBelem('cb' + this.id);
			if (notBlank(hstr)) { // if checked
				addTo(title + ": " + hstr);
				addPeriod();
				unrechk = true; // set checkbox true
				setUsage('Objective', this.title);
			}
		}
		if (!unrechk) { // if unremarkable not checked
			// text before s3 checkboxes
			hstr = getTXelem('txt' + this.id);
			if (notBlank(hstr)) {
				addTo(title + ": " + hstr);
				prevTxt = true;
				setUsage('Objective', this.title);
			}
			// POSITIVES ---------------------
			var harr = getCB3elem(this.id, '+'); // get the positives
			if (harr.length > 0) { // if there are positives then set the title if there is no previous text
				if (!prevTxt) {
					addTo(this.title + ": ");
					prevTxt = true;
				} else {           // else set a semicolon after the previous text
					addSemi();
				}
				setUsage('Objective', this.title);
			}
			
			// add Other to the special handling
			this.specialarr.push({name: "Other", positive: "", negative: ""});
			found = false;
			for (i=0; i<harr.length; i++) {
				
				// special handling for unnaturals, other
				found = false;
				for (j=0; j<this.natarr.length; j++) {
					if (this.natarr[j].name === harr[i].name) {
						harr[i].name = this.natarr[j].negative; // negative because its included in the positives naturally
						found = true;
						break;
					}
				}
				// special handling
				for (k=0; k<this.specialarr.length; k++) { // check for special handling of name
					if (this.specialarr[k].name === harr[i].name) {
						harr[i].name = this.specialarr[k].positive;
						found = true; 
						break;
					}
				}
				
				if (!found) { // if no special handling
					addTo(allLowerCap(harr[i].name));
				} else {
					addTo(harr[i].name); // if special handling
				}
				
				if (notBlank(harr[i].text)) { // if there is text for this item then add colon and text
					if (harr[i].name !== "") {
						addTo(": "); 
					}
					addTo(harr[i].text);
				}
				// looking forward, if there is another one coming and it is not blank then add semi or comma
				if (i < harr.length-1 && notBlank(harr[i].text)) { addSemi(); } // if end of text description add a semicolon
				if (i < harr.length-1 && !notBlank(harr[i].text)) { addComma(); } // if end of just the name add a comma
			}
			// NEGATIVES ----------------
			harr = getCB3elem(this.id, '-');
			if (harr.length > 0) {
				if (!prevTxt) {
					addTo(this.title + ": ");
					prevTxt = true;
				} else {
					addSemi();
				}
				setUsage('Objective', this.title);
			}
			
			// add Other to the special handling so that the word OTHER is not shown
			this.specialarr.push({name: "Other", positive: "", negative: ""});
			found = false; //define variable
			for (i=0; i<harr.length; i++) {
				
				// special handling for unnaturals
				found = false;
				for (j=0; j<this.natarr.length; j++) {
					if (this.natarr[j].name === harr[i].name) {
						harr[i].name = this.natarr[j].positive; // positive because its included in the negatives naturally
						found = true;
						break;
					}
				}
				// special handling
				for (k=0; k<this.specialarr.length; k++) {
					if (this.specialarr[k].name === harr[i].name) {
						harr[i].name = this.specialarr[k].negative; 
						found = true;
						break;
					}
				}
				
				if (!found) { // if no special handling
					addTo("no " + allLowerCap(harr[i].name));
				} else {
					addTo(harr[i].name); // if special handling
				}
				
				if (notBlank(harr[i].text)) { // if there is text then add colon
					if (harr[i].name !== "") { 
						addTo(": ");
					}
					addTo(harr[i].text);
				}
				// looking forward, if there is another one coming then add semi or comma
				if (harr[i].name !== "") {
					if (i < harr.length-1 && notBlank(harr[i].text)) { addSemi(); } // if end of text description add a semicolon
					if (i < harr.length-1 && !notBlank(harr[i].text)) { addComma(); } // if end of just the name add a comma
				}
			}
			if (prevTxt) {
				addPeriod();
			}
		}
	};
}


function writeExam (id, title, natarr, unre, specialarr) {
	unre = unre || true;
	specialarr = unre || [];
	var prevTxt = false;
	var prevTxt2 = false;
	var unrechk = false;
	var hstr = '';
	if (unre) {
		hstr = getCBelem('cb' + id);
		if (notBlank(hstr)) {
			addTo(title + ": " + hstr);
			addPeriod();
			unrechk = true;
			setUsage('Objective', initCap(allLowerCap(title)));
		}
	}
	if (!unrechk) {
		// text
		hstr = getTXelem('txt' + id);
		if (notBlank(hstr)) {
			addTo(title + ": " + hstr);
			prevTxt = true;
			setUsage('Objective', initCap(allLowerCap(title)));
		}
		// positives
		var harr = getCB3elem(id, '+');
		if (harr.length > 0) {
			if (!prevTxt) {
				addTo(title + ": ");
				prevTxt = true;
			} else {
				addSemi();
			}
			setUsage('Objective', initCap(allLowerCap(title)));
		}
		
		// add Other to the special handling
		natarr.push({name: "Other", positive: "", negative: ""});
		for (i=0; i<harr.length; i++) {
			// special handling for unnaturals, other
			for (j=0; j<natarr.length; j++) {
				if (natarr[j].name === harr[i].name) {
					harr[i].name = natarr[j].negative; // negative because its included in the positives naturally
					break;
				}
			}
			// special handling
			for (k=0; k<specialarr.length; k++) {
				if (specialarr[k].name === harr[i].name) {
					harr[i].name = specialarr[k].positive; 
					break;
				}
			}
			addTo(allLowerCap(harr[i].name));
			if (notBlank(harr[i].text)) {
				if (harr[i].name !== "") { 
					addTo(": ");
				}
				addTo(harr[i].text);
			}
			if (i < harr.length-1 && notBlank(harr[i].text)) { addSemi(); } // if end of text description add a semicolon
			if (i < harr.length-1 && !notBlank(harr[i].text)) { addComma(); } // if end of just the name add a comma
		}
		// negatives
		harr = getCB3elem(id, '-');
		if (harr.length > 0) {
			if (!prevTxt) {
				addTo(title + ": ");
				prevTxt = true;
			} else {
				addSemi();
			}
			setUsage('Objective', initCap(allLowerCap(title)));
		}
		
		// add Other to the special handling
		natarr.push({name: "Other", positive: "", negative: ""});
		var found = false; //define variable
		for (i=0; i<harr.length; i++) {
			// special handling for unnaturals
			found = false;
			for (j=0; j<natarr.length; j++) {
				if (natarr[j].name === harr[i].name) {
					harr[i].name = natarr[j].positive; // positive because its included in the negatives naturally
					found = true;
					break;
				}
			}
			// special handling
			for (k=0; k<specialarr.length; k++) {
				if (specialarr[k].name === harr[i].name) {
					harr[i].name = specialarr[k].negative; 
					found = true;
					break;
				}
			}
			if (!found) {
				harr[i].name = "no " + harr[i].name;
			}
			addTo(allLowerCap(harr[i].name));
			if (notBlank(harr[i].text)) {
				if (harr[i].name !== "") { 
					addTo(": ");
				}
				addTo(harr[i].text);
			}
			if (harr[i].name !== "") {
				if (i < harr.length-1 && notBlank(harr[i].text)) { addSemi(); } // if end of text description add a semicolon
				if (i < harr.length-1 && !notBlank(harr[i].text)) { addComma(); } // if end of just the name add a comma
			}
		}
		if (prevTxt) {
			addPeriod();
		}
	}
}

function savePos() {
	saveCHARTpos();
	return PCReport.length;
}
function insertPos(hstr, sp) {
	if (sp < PCReport.length) {
		PCReport = PCReport.substring(0,sp) + hstr + PCReport.substring(sp);
	}
	insertCHARTpos(hstr);
}
function insertPlanPos(hstr, sp) {
	if (sp < PCReport.length) {
		PCReport = PCReport.substring(0,sp) + hstr + PCReport.substring(sp);
	}
}
function saveCHARTpos() {
	switch (CHART_section) {
		case 'PRE': CHART_savepos = CHART_PRE.length; break;
		case 'C': CHART_savepos = CHART_C.length; break;
		case 'H': CHART_savepos = CHART_H.length; break;
		case 'A': CHART_savepos = CHART_A.length; break;
		case 'R': CHART_savepos = CHART_R.length; 
				  CHART_R_savepos = CHART_R.length; break;
		case 'T': CHART_savepos = CHART_T.length; 
				  CHART_T_savepos = CHART_T.length; break;
		case 'E': CHART_savepos = CHART_E.length; break;
	}
}
function insertCHARTpos(insert_string) {
	switch (CHART_section) {
		case 'PRE': if (CHART_savepos < CHART_PRE.length) {
			        CHART_PRE = CHART_PRE.substring(0,CHART_savepos) + insert_string + CHART_PRE.substring(CHART_savepos);
				  }  break;
		case 'C': if (CHART_savepos < CHART_C.length) {
			        CHART_C = CHART_C.substring(0,CHART_savepos) + insert_string + CHART_C.substring(CHART_savepos);
				  }  break;
		case 'H': if (CHART_savepos < CHART_H.length) {
					CHART_H = CHART_H.substring(0,CHART_savepos) + insert_string + CHART_H.substring(CHART_savepos);
				  }  break;
		case 'A': if (CHART_savepos < CHART_A.length) {
					CHART_A = CHART_A.substring(0,CHART_savepos) + insert_string + CHART_A.substring(CHART_savepos);
				  }  break;
		case 'R': if (CHART_R_savepos < CHART_R.length) {
					CHART_R = CHART_R.substring(0,CHART_R_savepos) + insert_string + CHART_R.substring(CHART_R_savepos);
				  }  break;
		case 'T': if (CHART_savepos < CHART_T.length) {
					CHART_T = CHART_T.substring(0,CHART_T_savepos) + insert_string + CHART_T.substring(CHART_T_savepos);
				  }  break;
		case 'E': if (CHART_savepos < CHART_E.length) {
					CHART_E = CHART_E.substring(0,CHART_savepos) + insert_string + CHART_E.substring(CHART_savepos);
				  }  break;
	}
}

// get the text from an item, sterilize the text, clean up the white space, remove the ending period
function getTXelem (id) {
	var hs = $('#' + id).val();
	hs = $('<p>' + hs + '</p>').text();
	hs = trimWhite(hs);
	hs = stripPeriod(hs);
	return hs;
}
function setTXelem  (element_id, element_value) {
	element_value = element_value.replace(/(\\r\\n|\\n|\\r)/gm, "\n"); // replace the '\n' with a real "\n"
	element_value = element_value.replace(/(\\')/gm, "'"); // replace the '\apos' with a real "apos"
	$('#' + element_id).val(element_value);
}

// get the checked item in a list of radio buttons
function getRBelem (id) {
	var hs = $("input:radio[name='" + id + "']:checked").val();
	if (hs === undefined) {
		hs = "";
	}
	return hs;
}

//get the value of a checkbox item
function getCBelem (id) {
	var hs = $("input:checkbox[id='" + id + "']:checked").val();
	if (hs === undefined) {
		hs = "";
	}
	return hs;
}

//-----------------------------------------------------------------------
// name: getCB3elem
// param: id: string with the ID of the section - AD: Admits and Denies
//		  state: string - + or - for which state you are looking for (ie. all of the positives) 
// return: array of {names, text} for items that match the state naturally or unaturally
//
// desc: gets a 3 stage checkbox list that matches the state you are looking for
//----------------------------------------------------------------------
function getCB3elem (id, state) {
	var arrs3 = [];
	var arrList = stage3objects[id];
	for (i=0; i<arrList.length; i++) {
		// if looking for positives, then find items in state3(+) and natural OR state3(-) and unnatural
		if (state === '+' && ((arrList[i].state3 === 3 && arrList[i].natural) || (arrList[i].state3 === 2 && !arrList[i].natural))) {
			if ( !(arrList[i].name === 'Other' && getTXelem(arrList[i].text) === '') ) { // ignore the weird situation where Other text is blank
				arrs3.push({name: arrList[i].name, text: getTXelem(arrList[i].text)});
			}
		}
		// if looking for negatives, then find items in state3(-) and natural OR state3(+) and unnatural
		if (state === '-' && ((arrList[i].state3 === 2 && arrList[i].natural) || (arrList[i].state3 === 3 && !arrList[i].natural))) {
			if ( !(arrList[i].name === 'Other' && getTXelem(arrList[i].text) === '') ) { // ignore the weird situation where Other text is blank
				arrs3.push({name: arrList[i].name, text: getTXelem(arrList[i].text)});
			}
		}
	}
	return arrs3;
}

//get the selected value of a drop down list
function getDLelem (id) {
	var hs =  $("#" + id + " option:selected" ).val();
	if (hs === undefined) {
		hs = "";
	}
	return hs;
}

//get the selected text of a drop down list
function getDLtextelem (id) {
	var hs =  $("#" + id + " option:selected" ).text();
	if (hs === undefined) {
		hs = "";
	}
	return hs;
}

// create the end of the previous plan card based on previous word or sentence
function planEndCardWrite(prevword, content, savedRptPos) {
	if (prevword !== cFIRST) {
		if (prevword === cWORD && content === cWORD) { 
			insertPlanPos(cCOMMA, savedRptPos);
		}
		if (prevword === cWORD && content === cSENT) { 
			insertPlanPos(cCOMMA + cRETURN, savedRptPos);
		}
		if (prevword === cSENT) {
			insertPlanPos(cRETURN, savedRptPos); 
		}
	}
	if (CHART_section === 'R') {
		if (CHART_R_prevword !== cFIRST) {
			CHART_savepos = CHART_R_savepos;
			if (CHART_R_prevword === cWORD && content === cWORD) { 
				insertCHARTpos(cCOMMA, CHART_R_savepos);
			}
			if (CHART_R_prevword === cWORD && content === cSENT) { 
				insertCHARTpos(cCOMMA + cRETURN, CHART_R_savepos);
			}
			if (CHART_R_prevword === cSENT) {
				insertCHARTpos(cRETURN, CHART_R_savepos); 
			}
		}
		CHART_R_prevword = content;
	}
	if (CHART_section === 'T') {
		if (CHART_T_prevword !== cFIRST) {
			CHART_savepos = CHART_T_savepos;
			if (CHART_T_prevword === cWORD && content === cWORD) { 
				insertCHARTpos(cCOMMA, CHART_T_savepos);
			}
			if (CHART_T_prevword === cWORD && content === cSENT) { 
				insertCHARTpos(cCOMMA + cRETURN, CHART_T_savepos);
			}
			if (CHART_T_prevword === cSENT) {
				insertCHARTpos(cRETURN, CHART_T_savepos); 
			}
		}
		CHART_T_prevword = content;
	}
}



function trimWhite (strIn) {
	//strIn = strIn.trimEnd();
	return strIn.trim();
}
function stripPeriod (strIn) {
	if (strIn.charAt(strIn.length-1) === '.') {
		return strIn.substring(0,strIn.length-1);
	}
	return strIn;
}
function addSpace (pT) {
	pT = pT || true;
	if (pT) {PCReport += " "; addToCHART (" ");}
}
function addReturn () {
	PCReport += cRETURN;
	if (CHART_section === 'PRE') {
		addToCHART (cRETURN);
	}
}
function addPeriod () {
	PCReport += ". ";
	addToCHART (". ");
}
function addComma () {
	PCReport += cCOMMA;
	addToCHART (cCOMMA);
}
function addSemi () {
	PCReport += "; ";
	addToCHART ("; ");
}
function notBlank (strIn) {
	return (strIn !== "") ? true : false;
}
function initCap (strIn) {
	if (notBlank(strIn)) {
		var chr1 = strIn.charAt(0);
		chr1 = chr1.toUpperCase();
		strIn = chr1 + strIn.substring(1);
	}
	return strIn;
}
function initLowerCap (strIn) {
	if (notBlank(strIn)) {
		var chr1 = strIn.charAt(0);
		chr1 = chr1.toLowerCase();
		strIn = chr1 + strIn.substring(1);
	}
	return strIn;
}
function allLowerCap (strIn) {
	return strIn.toLowerCase();
}
// modified for CHART
function addTo (strIn) {
	PCReport += strIn;
	addToCHART (strIn);
}
function addToCHART (strIn) {
	// skip over the section headers
	if (strIn === 'S: ' || strIn === 'O: ' || strIn === 'A: ' || strIn === 'P: ') {
		strIn = '';
	}
	switch (CHART_section) {
		case 'PRE': CHART_PRE += strIn; break;
		case 'C': CHART_C += strIn; break;
		case 'H': CHART_H += strIn; break;
		case 'A': CHART_A += strIn; break;
		case 'R': CHART_R += strIn; break;
		case 'T': CHART_T += strIn; break;
		case 'E': CHART_E += strIn; break;
	}
}

function writeCHART () {
	CHARTreport += CHART_PRE + cRETURN + cRETURN;
	CHARTreport += 'C: ' + CHART_C + cRETURN + cRETURN;
	CHARTreport += 'H: ' + CHART_H + cRETURN + cRETURN;
	CHARTreport += 'A: ' + CHART_A + cRETURN + cRETURN;
	CHARTreport += 'R: ' + CHART_R + cRETURN + cRETURN;
	CHARTreport += 'T: ' + CHART_T + cRETURN + cRETURN;
	CHARTreport += CHART_E;
}
function setCHART(section) {
	CHART_section = section;
}

function setChartSelection (chart_selected) {
	if (storageAvailable('localStorage')) {
		if (chart_selected) {
			localStorage.setItem('chart', 'true');
		} else {
			localStorage.setItem('chart', 'false');
		}
	}
}


// end of file