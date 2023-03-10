class TeamMember {

	dv = null;
	pg = null;
	window = null;
	mu = null;
	participants = [];
	organizer = [];

	init(dv, window) {
		this.dv = dv;
		this.pg = dv.current();
		this.window = window;
	}


	getCurrentTime(offset) {
		let dt = new Date();
		let utc = dt.getTime() + (dt.getTimezoneOffset() * 60000);
		let nd = new Date(utc + (3600000*offset));
		return nd.toLocaleTimeString();
	}





	getTeamMemberInfo(dv, window) {
		this.init(dv, window);
		let mypage=dv.current();
		let name=mypage.name;
		let email=mypage.email;
		let sfsfid=mypage.sfsfid;
		let sfsfide=mypage.sfsfide;
		let mobile=mypage.mobile;
		let country=mypage.country;
		let city=mypage.city;
		let tz=mypage.tz;

		/*
		 * Get the team page for the member,
		 * if it exists and has a folder note
		 * like "- -.md"
		 */
		let teampagepath = "Business/01 - Team/"+name+"/- -";
		let teampage=dv.page(teampagepath);

		/*
		 * Create the header
		 */
		let hdr  = "|Email|Chat|Information|";
		let hdr2 = "|-----|----|-----------|";
		if (typeof teampage !== 'undefined') {
		  hdr  += 'Sharepoint|';
		  hdr2 += '----------|';
		}
		if (typeof mobile !== 'undefined') {
			hdr  += 'Mobile|';
			hdr2 += '------|';
		}
		if (tz !== 'undefined') {
			if (country && city ) {
				hdr += country + ' / ' + city + '|';
			} else if (country) {
				hdr += country + '|';
			} else if (city) {
				hdr += city + '|';
			}
			hdr2 += '------|';
		}

		if (typeof sfsfid !== 'undefined') {
			sfsfid = 'selected_user=' + sfsfid;
		} else if (typeof sfsfide !== 'undefined') {
			sfsfid = 'selected_user_encoded=' + sfsfide;
		}

		/*
		 * Create the body
		 */
		let body = "|";
		body += "[📨](mailto:"+email+")|";
		body += "[🗣](https://teams.microsoft.com/l/chat/0/0?users="+email+")|";
		body += "[📇](https://performancemanager5.successfactors.eu/xi/ui/pages/empfile/liveprofile.xhtml?" + sfsfid + ")|";
		if (typeof teampage !== 'undefined') {
		  body += "[👥](https://sap.sharepoint.com/:f:/r/sites/204418/Shared%20Documents/01%20-%20Team/";
		  body += name.replace(' ', '%20');
		  body += ")|";
		}
		if (typeof mobile !== 'undefined') {
			body += "[📱](tel://";
			body += mobile;
			body += ")|";
		}
		if (typeof tz !== 'undefined') {
			body += this.getCurrentTime(tz);
			body += "|";
		}

		let output = hdr+"\n"+hdr2+"\n"+body+"\n";

		if (output !== "") {
			dv.header(1, name);
			dv.paragraph(hdr+"\n"+hdr2+"\n"+body+"\n");
		}
	}
}
