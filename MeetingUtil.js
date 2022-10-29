class MeetingUtil {
	dv = null;

	init(dv) {
		this.dv = dv;
	}

	getMeetings(sort, startDate, endDate, tags, etags) {
		const pages = this.getMeetingPages(sort, startDate, endDate, tags, etags);

		return pages;
	}

	getMeetingPages(sort, startDate, endDate, tags, etags) {
		/*
		 * Parse the tags
		 */
		let searchstr = "#meeting";

		/*
		for (const tag of tags) {
			if (tag != "meeting") {
				searchstr += " and #" + tag + "";
			}
		}
		*/

		for (const tag of etags) {
			searchstr += " and -#" + tag + "";
		}

		const pages = this.dv.pages(searchstr).where(page => {
			const fileName = page.file.name
			const meetingRe = /^.*?(\d\d\d\d)-(\d\d)-(\d\d) - (\d\d)(\d\d).*/
			const meetingData = fileName?.match(meetingRe)

			if(meetingData) {
				page.meetingYear     = meetingData[1];
				page.meetingMonth    = meetingData[2];
				page.meetingDay      = meetingData[3];
				page.meetingHours    = meetingData[4];
				page.meetingMinutes  = meetingData[5];
				page.meetingTime     = meetingData[4] + ":" + meetingData[5];
				page.meetingDate     = meetingData[1] + "-" + meetingData[2] + "-" + meetingData[3];
				page.meetingString   = meetingData[1] + "-" + meetingData[2] + "-" + meetingData[3] + " " + meetingData[4] + ":" + meetingData[5];
				page.meetingDateTime = new Date(page.meetingString);

				if(typeof endDate   !== 'undefined' &&
				   typeof startDate !== 'undefined' && (
				     page.meetingDateTime >= endDate ||
				     page.meetingDateTime <  startDate
				   )
				  ) { return 0; }

				return 1;
			}
		}).sort(page => page.meetingString, sort)

		return pages;
	}

	padTo2Digits(num) {
		return num.toString().padStart(2, '0');
	}

	formatDate(date) {
		date.setHours(0, 0, 0, 0);
		return [
			date.getFullYear(),
			this.padTo2Digits(date.getMonth() + 1),
			this.padTo2Digits(date.getDate()),
		].join('-');
	}

	groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}

}
