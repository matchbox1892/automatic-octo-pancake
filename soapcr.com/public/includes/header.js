auth = new Authenticate();

$(document).ready(function() {
	$('#HDR_menuicon').click(function (){
		menu_toggle();
	});
	$('#HDR_menu_cancel').click(function (){
		menu_cancel();
	});
	$('#HDR_menulist').click(function () {
		menu_cancel();
	});

	auth.auth_setup();
});

function menu_toggle(){
	if($('#HDR_mainmenu').is(':visible')) {
		menu_cancel();
	} else {
		menu_open();
	}
}
function menu_open(){
	auth.close_all();
	auth.show_mask();
	$('#HDR_mainmenu').show();
}
function menu_cancel(){
	auth.hide_mask();
	$('#HDR_mainmenu').hide();
}

//------- AUTH FUNCTIONS -----------------
function load_auth_info(name, id, subscription_expired, token_key, current_pagename) {
	auth.auth_name = name;
	auth.auth_id = id;
	auth.subscription_expired = subscription_expired;
	auth.auth_token = token_key;
	if (current_pagename === null) {
		current_pagename = window.location.href;
	}
	auth.current_pagename = current_pagename;
}

function Authenticate () {
	this.login_id = 'HDR_right_login';
	this.signup_id = 'HDR_right_subscribe';
	this.logout_id = 'HDR_right_logout';
	this.profile_id = 'HDR_right_profile';
	this.profile_name_id = 'HDR_right_username';
	this.sub_expired = 'HDR_right_expired';
	this.mask_id = 'HDR_mask';
	this.protitle = 'HDR_protitle';
	this.menu_profile = 'HDR_menulist_profile';
	this.menu_logout = 'HDR_menulist_logout';
	this.menu_custom = 'HDR_menulist_custom';
	this.auth_name = '';
	this.auth_id = '';
	this.subscription_expired = true;
	this.auth_token = '';
	this.current_pagename = '';
	this.logged_in_location = '/proversion';
	this.logged_in_expired_location = '/basicversion';
	this.logged_out_location = '/basicversion';
	this.profile_location = '/usersettings';
	this.signup_location = '/subscribe';
	this.prevent_doubleclick = false;
	this.timeout_begin_time = 0;
	this.timeout_last_session_time = 0;
	this.timeout_last_page_touch = 0;
	this.timeout_initial_length_minutes = 50;
	//this.timeout_current_url = window.location.href;
	this.timeout_applies_to_this_page = false;
	this.timeout_pages = ['soapcrpro.php', 'buildprocedure.php']; 
	this.timeout_landing_page = "/public/timeout/timeout.php";
	this.timeout_touch_count = 0;
	this.timeout_run_function = null;
	
	this.auth_setup = function () {
		$('#' + this.login_id).click(function(){
			this.close_all();
			this.auth_login();
		}.bind(this));
		$('#auth_login_cancel').click(function(){
			this.auth_login_cancel();
		}.bind(this));
		
		$('#auth_forgot_password').click(function(){
			this.close_all();
			this.auth_forgot_password();
		}.bind(this));
		$('#auth_forgot_cancel').click(function(){
			this.auth_forgot_cancel();
		}.bind(this));
		
		$('#' + this.logout_id).click(function(){
			this.auth_handle_logout();
		}.bind(this));
		
		$('#' + this.signup_id).click(function(){
			this.close_all();
			this.auth_signup();
		}.bind(this));
		$('#auth_signup_cancel').click(function(){
			this.auth_signup_cancel();
		}.bind(this));
		$('#auth_signup_password_peek').hover(
			function() {
				$('#auth_signup_password' ).prop({type:"text"});
			}, 
			function() {
			    $('#auth_signup_password').prop({type:"password"});
			}
		);

		$('#' + this.profile_id).click(function(){
			this.close_all();
			this.auth_profile();
		}.bind(this));
		$('#' + this.profile_name_id).click(function(){
			this.close_all();
			this.auth_profile();
		}.bind(this));
		$('#auth_profile_cancel').click(function(){
			this.auth_profile_cancel();
		}.bind(this));
		$('#auth_profile_password_peek').hover(
			function() {
				$('#auth_profile_password' ).prop({type:"text"});
			}, 
			function() {
			    $('#auth_profile_password').prop({type:"password"});
			}
		);

		$('.auth_entry_body input').click(function(){
			$('#auth_login_errors').html('');
			$('#auth_forgot_errors').html('');
			$('#auth_signup_errors').html('');
			$('#auth_profile_errors').html('');
		});
		

		// handle submit on enter keypress
		$('.auth_entry_body input').keypress(function (e) {
			if (e.which == 13) {
				this.submit_based_on_whats_open();
			}
		}.bind(this));
		
		// setup timeout
		this.timeout_begin_time = this.getTime();
		this.timeout_last_session_time = this.getTime();
		this.timeout_last_page_touch = this.getTime();
		$('body').on('keyup click paste', function() {
			this.timeout_last_page_touch = this.getTime();
		}.bind(this));
		this.timeout_applies_to_this_page = this.timeout_this_page();
		setTimeout(function(){ 
			this.handle_timeout();
		}.bind(this), this.timeout_initial_length_minutes*60*1000);
		
		this.set_state();
	}

	this.auth_login = function () {
		this.show_mask();
		$('#auth_login_container').show();
	}
	this.auth_login_cancel = function () {
		$('#auth_login_username').val('');
		$('#auth_login_password').val('');
		$('#auth_login_errors').html('');
		$('#auth_login_container').hide();
		this.hide_mask();
	}
	
	this.auth_forgot_password = function () {
		this.show_mask();
		$('#auth_forgot_container').show();
	}
	this.auth_forgot_cancel = function () {
		$('#auth_forgot_username').val('');
		$('#auth_forgot_errors').html('');
		$('#auth_forgot_button').show();
		$('#auth_forgot_container').hide();
		this.hide_mask();
	}
	
	this.auth_signup = function () {
		$(window).unbind('beforeunload'); // don't ask about leaving site
		this.change_page(this.signup_location);
		//$('#auth_signup_container').show();
	}
	this.auth_signup_cancel = function () {
		/*
		$('#auth_signup_email').val('');
		$('#auth_signup_password').val('');
		$('#auth_signup_firstname').val('');
		$('#auth_signup_lastname').val('');
		$('#auth_signup_container').hide();
		*/
	}
	this.auth_profile = function () {
		$(window).unbind('beforeunload'); // don't ask about leaving site
		this.change_page(this.profile_location);
		/*
		var data = {request_type: 'getprofile'};
		this.auth_server(data);
		*/
	}
	this.auth_profile_cancel = function () {
		/*
		$('#auth_profile_email').val('');
		$('#auth_profile_password').val('');
		$('#auth_profile_firstname').val('');
		$('#auth_profile_lastname').val('');
		$('#auth_profile_container').hide();
		*/
	}
	
	this.close_all = function () {
		this.auth_login_cancel();
		this.auth_forgot_cancel();
		this.auth_signup_cancel();
		this.auth_profile_cancel();
		menu_cancel();
	}

	this.submit_based_on_whats_open = function () {
		if ($('#auth_login_container').is(":visible")) {
			this.auth_handle_login();
		}
		if ($('#auth_forgot_container').is(":visible")) {
			this.auth_handle_forgot();
		}
		/*
		if ($('#auth_signup_container').is(":visible")) {
			this.auth_handle_signup
		}
		if ($('#auth_profile_container').is(":visible")) {
			
		}
		*/
	}
	
	this.auth_handle_login = function () {
		var username = this.getTXelem('auth_login_username');
		var password = this.getTXelem('auth_login_password');
		var rememberme = this.getCBelemTF('auth_login_rememberme');
		var data = {request_type: 'login', email: username, password:password, rememberme:rememberme};
		this.auth_server(data);
	}
	
	this.auth_handle_forgot = function () {
		var username = this.getTXelem('auth_forgot_username');
		var data = {request_type: 'forgot', username: username};
		this.auth_server(data);
	}
	
	this.auth_handle_logout = function () {
		var data = {request_type: 'logout'};
		this.auth_server(data);
	}
	
	this.auth_handle_signup = function () {
		var email = this.getTXelem('auth_signup_email');
		var password = this.getTXelem('auth_signup_password');
		var firstname = this.getTXelem('auth_signup_firstname');
		var lastname = this.getTXelem('auth_signup_lastname');
		var data = {request_type: 'signup', email: email, password:password, firstname:firstname, lastname:lastname};
		this.auth_server(data);
	}
	
	this.set_state = function () {
		if (this.auth_name === '' & this.auth_id === '') {
			this.state_logged_out();
		} else {
			if (this.subscription_expired) {
				this.state_logged_in_expired(this.auth_name);
			} else {
				this.state_logged_in(this.auth_name);
			}
		}
	}
	this.state_logged_in = function (name) {
		$('#' + this.protitle).show();
		$('#' + this.login_id).hide();
		$('#' + this.signup_id).hide();
		$('#' + this.logout_id).show();
		$('#' + this.profile_name_id).html(name);
		$('#' + this.profile_name_id).show();
		$('#' + this.profile_id).show();
		$('#' + this.menu_profile).show();
		$('#' + this.menu_logout).show();
		$('#' + this.menu_custom).show();
	}
	this.state_logged_in_expired = function (name) {
		$('#' + this.protitle).show();
		$('#' + this.login_id).hide();
		$('#' + this.signup_id).hide();
		$('#' + this.logout_id).show();
		$('#' + this.profile_name_id).html(name);
		$('#' + this.profile_name_id).show();
		$('#' + this.profile_id).show();
		$('#' + this.sub_expired).show();
		$('#' + this.menu_profile).show();
		$('#' + this.menu_logout).show();
		$('#' + this.menu_custom).show();
	}
	
	this.state_logged_out = function () {
		$('#' + this.login_id).show();
		$('#' + this.signup_id).show();
		$('#' + this.logout_id).hide();
		$('#' + this.profile_name_id).html('');
		$('#' + this.profile_name_id).hide();
		$('#' + this.profile_id).hide();
		$('#' + this.menu_profile).hide();
		$('#' + this.menu_logout).hide();
		$('#' + this.menu_custom).hide();
	}
	this.timeout_this_page = function () {
		for (var i=0; i<this.timeout_pages.length;i++) {
			//if (this.timeout_current_url.indexOf(this.timeout_pages[i]) > -1) {
			if (this.current_pagename.indexOf(this.timeout_pages[i]) > -1) {
				return true;
			}
		}
		return false;
	}
	
	this.handle_timeout = function () {
		if (!this.timeout_applies_to_this_page) { return; }
		var current_time = this.getTime();
		var diff_session = current_time - this.timeout_last_session_time;
		var diff_page = current_time - this.timeout_last_page_touch;
		var diff_page_begin = this.timeout_last_page_touch - this.timeout_begin_time;
		var time_compare = this.timeout_initial_length_minutes*60*1000;
		
		if (diff_page > time_compare) {
			if (diff_page_begin > 1000) {
				save_pcr_data ('Last Report');
			}
			this.change_page(this.timeout_landing_page);
			return false;
		}
		if (diff_session > time_compare) {
			this.timeout_touch_session();
			this.timeout_last_session_time = this.getTime();
			setTimeout(function(){ 
				this.handle_timeout();
			}.bind(this), this.timeout_initial_length_minutes*60*1000);
		}
	}
	
	this.timeout_touch_session = function () {
		this.timeout_touch_count += 1;
		if (this.timeout_touch_count < 5) {
			$.ajax({
				type: 'POST',
				beforeSend: function(req) {
					req.setRequestHeader('Authorization', 'Bearer ' + this.auth_token);
				},
				url: '/public/includes/auth_server.php',
				data:  {request_type: 'touch'},
				datatype: 'json',
				error: function (results) { $('.busySpinner').hide(); alert('Something went wrong. Sorry.'); },
				success: function (results) {
					var results = this.validate_json_results(results);
					if (results.success) {
						this.timeout_touch_count = 0;
					} else {
						setTimeout(function(){ 
							this.timeout_touch_session();
						}.bind(this), 1*60*1000);
					}
				}.bind(this)
			});
		}
	}

	this.auth_server = function (obj_data) {
		if (this.prevent_doubleclick) { return; }
		$('.busySpinner').show();
		this.prevent_doubleclick = true;
		var auth_header = "Bearer " + this.auth_token;
		$.ajax({
			type: 'POST',
			url: '/backend/auth_server',
			beforeSend: function(req) {
				req.setRequestHeader('Authorization', auth_header);
			},
			data: obj_data,
			datatype: 'json',
			error: function (results) { $('.busySpinner').hide(); alert('Something went wrong. Sorry.'); },
			success: function (results) { 
				$('.busySpinner').hide();
				this.prevent_doubleclick = false;
				var results = this.validate_json_results(results);
				this.handle_results(results, obj_data.request_type);
			}.bind(this)
		});
	}
	
	this.handle_results = function (results, request) {
		var html = '';
		var name = '';
		for (var i=0; i<results.error.length; i++) {
			html += this.getErrorMessage(results.error[i]) + ' ';
		}
		
		switch (request) {
		case 'login': 
			$('#auth_login_errors').html(html);
			if (results.success) {
				$(window).unbind('beforeunload'); // don't ask about leaving site
				if (!results.data.auth_subscription_expired) {
					this.change_page(this.logged_in_location);
				} else {
					if (results.data.auth_name !== undefined) { name = results.data.auth_name; }
					if (results.data.auth_token !== undefined) { this.auth_token = results.data.auth_token; }
					this.state_logged_in_expired(name);
					$('#auth_login_container').hide();
					this.hide_mask();
				}
			}
			break;
			case 'forgot': 
				$('#auth_forgot_errors').html(html);
				if (results.success) {
					$('#auth_forgot_errors').append('An email has been sent with a link to change your password.');
					$('#auth_forgot_button').hide();
				}
			break;
			case 'logout':
				if (results.success) {
					$(window).unbind('beforeunload'); // don't ask about leaving site
					this.change_page(this.logged_out_location);
				}
				if (results.data.auth_token !== undefined) { this.auth_token = results.data.auth_token; }
				this.state_logged_out();
				break;
			case 'signup': 
				$('#auth_signup_errors').html(html);
				if (results.success) {
					var email = this.getTXelem('auth_signup_email');
					var password = this.getTXelem('auth_signup_password');
					var data = {request_type: 'login', email: email, password:password};
					this.auth_server(data);
					$('#auth_signup_container').hide();
				}
				break;
			case 'getprofile': 
				$('#auth_profile_errors').html(html);
				if (results.success) {
					this.setTXelem('auth_profile_email', results.data.email);
					this.setTXelem('auth_profile_firstname', results.data.firstname);
					this.setTXelem('auth_profile_lastname', results.data.lastname);
					$('#auth_profile_container').show();
				}
				break;
		}
	}
	
	this.validate_json_results = function (json_string) {
		var debug = true;
		var results = {};
	  try {
	      results = JSON.parse(json_string);
	  } catch (e) {
	  	if (debug) {
	  		var cancel_icon = "<span style='cursor: default' onclick=\"$('#dbjsonerror').hide();\">X&nbsp&nbsp</span>";
	    	$('#dbjsonerror').html(cancel_icon + json_string);
	    	$('#dbjsonerror').show();
	  	}
	  	first_bracket = json_string.indexOf('{');
	  	last_bracket = json_string.lastIndexOf('}');
	  	new_json_string = json_string.substring(first_bracket, last_bracket+1);
	  	try {
	          results = JSON.parse(new_json_string);
	      } catch (e) {
	      	results = {};
	      	results['error'] = [];
	      	results['success'] = false;
	      	results['JSONerror'] = true;
	      	results['error'][0] = 'Sorry, unable to connect to the database. Try again later.';
	      }
	  }
	  return results;
	}
	
	this.getErrorMessage = function (error_type) {
		switch (error_type) {
		case 'DATABASE ERROR' : return "Sorry, we are unable to connect to the database. Please, try again later."; break;
		case 'USERNAME PASSWORD NOT FOUND' : return "The email or password does not match our records. Try again."; break;
		case 'EMAIL UNAVAILABLE' : return "The email is already used. Use another email."; break;
		case 'USERNAME UNAVAILABLE' : return "The email is already used. Use another."; break;
		case 'ROLE REQUIRED' : return "The role is required"; break;
		case 'PASSWORD RESET TIME EXPIRED' : return "For security reasons your time has expired to reset your password. Try the forgot password again."; break;
		case 'PASSWORD LINK ERROR' : return "There is an issue with the link that was provided. Please try the forgot password again."; break;
		case 'VERIFY LINK ERROR' : return "There is an issue with the link that was provided. Please try the link again."; break;
		case 'USERNAME NOT FOUND' : return "The email was not found in our records"; break;
		case 'USERNAME NOT VALID' : return "The email has invalid characters or length."; break;
		case 'EMAIL NOT VALID' : return "The email has invalid characters or length."; break;
		case 'PASSWORD NOT VALID' : return "The password has invalid characters or length."; break;
		case 'COOKIE ERROR' : return "There was an error processing the cookie."; break;
		case 'NO INPUT' : return "Enter value(s)"; break;
		case 'SUBSCRIPTION EXPIRED' : return "Your subscription has expired. Go to your profile and subscribe.";
		case 'EMAIL NOT SENT' : return "There was an error in sending your email."; break;
		case 'TOKEN ERROR' : return "Sorry, we are unable to verify our existance. Please, reload webpage."; break;
		default: return "Sorry there was an unknown system error.";
		}
	}
	
	this.change_page = function (new_location) {
		var auth_header = "Bearer " + this.auth_token;
		$.ajax({
			type: 'POST',
			url: '/backend/auth_server',
			beforeSend: function(req) {
				req.setRequestHeader('Authorization', auth_header);
			},
			data: {request_type: 'set_token_session'},
			datatype: 'json',
			error: function (results) { alert('Something went wrong. Sorry.'); },
			success: function (results) { 
				window.location = new_location;
				return false;
			}
		});
	}

	this.show_mask = function() {
		$('#HDR_mask').show();
		$('#HDR_mask').animate({opacity: 0.9}, 50);
	}
	this.hide_mask = function() {
		$('#HDR_mask').animate({opacity: 0}, 0, 
			function(){
				$('#HDR_mask').hide();
			}
		);
	}

	this.getCBelemTF = function (id) {
		var hs = $("input:checkbox[id='" + id + "']").prop('checked');
		if (hs === undefined) {
			hs = false;
		}
		return hs;
	}
	this.getTXelem = function (id) {
		var hs = $('#' + id).val();
		if (hs === undefined) {
			hs = "";
		}
		return hs;
	}
	this.setTXelem = function (element_id, element_value) {
		element_value = element_value.replace(/(\\r\\n|\\n|\\r)/gm, "\n"); // replace the '\n' with a real "\n"
		$('#' + element_id).val(element_value);
	};
	this.getTime = function () {
		var dt = new Date();
		return dt.getTime();
	}
}