class Meetings {
	listMeetings(dv, start, end, sort) {
		Date.prototype.addDays = function(days) {
				var date = new Date(this.valueOf());
				date.setDate(date.getDate() + days);
				return date;
		}

		let pg = dv.current();

		let sstart = typeof start !== 'undefined' ? start : pg.start;
		let send   = typeof end   !== 'undefined' ? end   : pg.end;

		let curDate = new Date(this.formatDate(new Date()));
		let startDate = curDate.addDays(sstart);

		let endDate   = curDate.addDays(send);

		let ssort  = typeof sort  !== 'undefined' ? sort  : "asc";

		let pages = dv.pages("#meeting")
			.where(p =>
					 p.date
				&& p.file.name != pg.file.name
				&& new Date(p.date) < endDate
				&& new Date(p.date) >= startDate
			)
			.sort(p => p.date, ssort)
		;

		for (let group of pages.groupBy(
					b => this.formatDate(new Date(b.date))
				)
			) {
			dv.table(
					[group.key.padEnd(12,"　"), "Meeting".padEnd(20, "　")],
					group.rows
						.map(k => [ k.date, k.file.link ]
					)
				)
			;
		}
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
}
