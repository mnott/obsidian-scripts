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

	getTeamMemberInfo(dv, window) {
		this.init(dv, window);
		let mypage=dv.current();
		let name=mypage.name;
		let email=mypage.email;
		let sfsfid=mypage.sfsfid;

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

		/*
		 * Create the body
		 */
		let body = "|";
		body += "[📨](mailto:"+email+")|";
		body += "[🗣](https://teams.microsoft.com/l/chat/0/0?users="+email+")|";
		body += "[📇](https://performancemanager5.successfactors.eu/xi/ui/pages/empfile/liveprofile.xhtml?selected_user=" + sfsfid + ")|";
		if (typeof teampage !== 'undefined') {
		  body += "[👥](https://sap.sharepoint.com/:f:/r/sites/204418/Shared%20Documents/01%20-%20Team/";
		  body += name.replace(' ', '%20');
		  body += ")|";
		}

		let output = hdr+"\n"+hdr2+"\n"+body+"\n";

		if (output !== "") {
			dv.header(1, "Information");
			dv.paragraph(hdr+"\n"+hdr2+"\n"+body+"\n");
		}
	}
}
