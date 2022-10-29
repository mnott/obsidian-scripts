class Meeting {

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
		this.participants = [];
		this.organizer = [];
		this.mu = null;
		if (typeof this.mu !== 'undefined') {
			this.mu = window.customJS.MeetingUtil;
			this.mu.init(dv);
		}

		if (typeof this.pg?.participants !== 'undefined') {
			this.participants = this.pg.participants;
		}

		if (typeof this.organizer === 'string' || this.organizer instanceof String) {
			this.organizer = [this.organizer];
		}

		if (typeof this.participants === 'string' || this.participants instanceof String) {
			this.participants = [this.participants];
		}

		/*
		 * If we have neither organizer nor participants,
		 * try to find a name.
		 */
		if (this.participants.length == 0) {
			if (typeof this.pg?.name !== 'undefined') {
				this.participants.push(this.pg.name);
			}
		}
	}



	getRelatedMeetings(dv, window, start, end, params) {
		this.init(dv, window);

		Date.prototype.addDays = function(days) {
				var date = new Date(this.valueOf());
				date.setDate(date.getDate() + days);
				return date;
		}

		/*
		 * Sanity Check if we were just creating a new file.
		 * We have to change the file if that's the case, so
		 * that Obsidian actually persists it.
		 */
		if (typeof this.pg === 'undefined') {
			console.log("Early return.");
			return null;
		}

		let curDate   = new Date(this.mu.formatDate(new Date()));
		let startDate = curDate.addDays(start?start:0);
		let endDate   = curDate.addDays(end?end:0);
		let ssort     = params?.sort ? params.sort : "asc";

		/*
		 * Collect the tags, if any
		 */
		let stags     = params?.tags ? params.tags : [];
		let setags    = params?.etags? params.etags: [];

		if (typeof this.pg.tags !== 'undefined') {
			stags = stags.concat(this.pg.tags);
		}

		if (typeof this.pg.etags !== 'undefined') {
			setags = setags.concat(this.pg.etags);
		}

		let meetings  = this.mu.getMeetings(ssort, startDate, endDate, stags, setags);

		/*
		 * Each meeting is a page. We can now work
		 * through the pages that we've got. We
		 * essentially want to get only those pages
		 * where we have a commonality.
		 */
		let relevantMeetings = [];

		for(const meeting of meetings) {
			let organizer    = meeting.organizer    ? meeting.organizer:[];
			let participants = meeting.participants ? meeting.participants:[];

			if (typeof organizer === 'string' || organizer instanceof String) {
				organizer = [organizer];
			}

			if (typeof participants === 'string' || participants instanceof String) {
				participants = [participants];
			}

			/*
			 * Exclude names if given
			 */
			organizer    = organizer   .filter( ( el ) => !params?.exclude?.includes( el ) );
			participants = participants.filter( ( el ) => !params?.exclude?.includes( el ) );

			/*
			 * Don't return the current meeting
			 */
			if (meeting.file.name === this.pg.file.name) {
				continue;
			}

			/*
			 * participants in this.participants?
			 */
			let found = participants?.some(r => this.participants?.includes(r));
			if (found) {relevantMeetings.push(meeting); continue;}

			/*
			 * participants in this.organizers?
			 */
			found = participants?.some(r => this.organizer?.includes(r));
			if (found) {relevantMeetings.push(meeting); continue;}


			/*
			 * this.participants in participants?
			 */
			found = this.participants?.some(r => participants?.includes(r));
			if (found) {relevantMeetings.push(meeting); continue;}

			/*
			 * this.participants in organizers?
			 */
			found = this.participants?.some(r => organizer?.includes(r));
			if (found) {relevantMeetings.push(meeting); continue;}

			/*
			 * If we have no participants and no organzier, but a matching
			 * tag...
			 */
			if (   typeof this.pg.tags      !== 'undefined'
				&& typeof this.participants !== 'undefined'
				&& typeof this.organizer    !== 'undefined') {
				for(const tag of meeting.tags) {
					if (tag === "meeting") {continue;}
					for(const mtag of this.pg.tags) {
						if (tag === mtag) {
							relevantMeetings.push(meeting);
							found = 1;
						}
						if(found) { break; }
					}
					if(found) { break; }
				}
			}
		}

		if (relevantMeetings.length > 0 && typeof params?.header !== 'undefined') {
			dv.header(1, params.header);
		}

		const groupedMeetings = this.mu.groupBy(relevantMeetings, meeting => meeting.meetingDate);

		for (const meetingGroup of groupedMeetings) {
			dv.table(
				[meetingGroup[0].padEnd(17,"　"), "Meeting".padEnd(20, "　")],
				meetingGroup[1].map(k=> [k.meetingTime, k.file.link])
			);
		}
	}
}
