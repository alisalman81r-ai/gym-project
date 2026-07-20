import type { Trainer } from "@/types";

export const TRAINERS: Trainer[] = [
	{
		id: "marcus-reed",
		name: "Marcus Reed",
		role: "Head Strength Coach",
		experience: "10+ years · CSCS, USAW Level 2",
		bio: "Marcus has coached powerlifters and everyday athletes alike toward measurable strength gains, building programs around slow, honest progression rather than shortcuts.",
		image: { src: "/images/trainers/marcus-reed.jpg", alt: "Portrait of Marcus Reed, Head Strength Coach" },
		longBio: [
			"Marcus started coaching after a decade of competitive powerlifting left him more interested in building other people's total than chasing his own. He's spent the years since translating that competition-floor experience into programming that works for members who will never step on a platform — the same principles of progressive overload, honest load management, and technical patience, just pointed at different goals.",
			"His approach is unglamorous by design: track the numbers, add weight when the numbers say you're ready, and leave your ego at the door on the days they don't. Members who stick with Marcus for a full training block tend to describe the same thing — slower progress than they expected in month one, and results by month six that surprise them.",
		],
		certifications: ["CSCS — Certified Strength and Conditioning Specialist", "USA Weightlifting Level 2 Coach", "USAPL Coaching Certification"],
		specialties: ["Powerlifting", "Progressive Overload Programming", "Olympic Lift Technique"],
		philosophy: "Strength is just a receipt for the work you actually did — my job is making sure the work is real.",
	},
	{
		id: "alina-cruz",
		name: "Alina Cruz",
		role: "HIIT & Conditioning",
		experience: "8 years · NASM-CPT",
		bio: "A former competitive sprinter, Alina designs metabolic conditioning sessions that keep members coming back for more — and genuinely enjoying the burn.",
		image: { src: "/images/trainers/alina-cruz.jpg", alt: "Portrait of Alina Cruz, HIIT & Conditioning Coach" },
		longBio: [
			"Alina raced 200m and 400m through college, and everything she coaches now is downstream of that background: intervals with a real purpose, work-to-rest ratios that are actually programmed rather than guessed, and a firm belief that conditioning should make you fitter, not just more tired.",
			"She runs the club's group HIIT sessions and works one-on-one with members prepping for anything from a first 5K to an obstacle race. Her sessions are demanding, but she's known for reading the room — scaling intensity in real time so the person next to a college athlete isn't quietly drowning.",
		],
		certifications: ["NASM-CPT — Certified Personal Trainer", "ACE Group Fitness Instructor", "USATF Level 1 Coaching Certification"],
		specialties: ["HIIT Programming", "Metabolic Conditioning", "Sprint Mechanics"],
		philosophy: "Conditioning isn't about being the most exhausted person in the room — it's about being able to do it again tomorrow.",
	},
	{
		id: "daniel-osei",
		name: "Daniel Osei",
		role: "Functional Movement",
		experience: "12+ years · Licensed Physiotherapist",
		bio: "A certified physiotherapist turned coach, Daniel focuses on mobility, injury prevention, and the kind of training longevity that keeps members in the gym for decades.",
		image: { src: "/images/trainers/daniel-osei.jpg", alt: "Portrait of Daniel Osei, Functional Movement Coach" },
		longBio: [
			"Daniel spent his first eight years in clinical physiotherapy before moving to the coaching side full-time — he got tired of only meeting people after something had already gone wrong. Now he screens movement patterns before they become injuries, and rebuilds them for members coming back from one.",
			"A lot of his work looks unremarkable from the outside: hip mobility drills, single-leg stability work, tempo-controlled accessory lifts. It's the training most people skip on their way to the barbell, and it's exactly why his long-term clients are still training pain-free years after they started.",
		],
		certifications: [
			"Licensed Physiotherapist (DPT)",
			"FMS Level 2 — Functional Movement Systems",
			"NASM-CES — Corrective Exercise Specialist",
		],
		specialties: ["Mobility & Injury Prevention", "Post-Rehab Training", "Movement Screening"],
		philosophy: "The best training program is the one you're still doing, injury-free, ten years from now.",
	},
	{
		id: "priya-nair",
		name: "Priya Nair",
		role: "Nutrition & Wellness",
		experience: "7 years · Registered Sports Dietitian",
		bio: "Priya builds sustainable, no-extremes meal plans tailored to each member's training load — nutrition coaching built for real life, not a fad.",
		image: { src: "/images/trainers/priya-nair.jpg", alt: "Portrait of Priya Nair, Nutrition & Wellness Coach" },
		longBio: [
			"Priya trained as a clinical dietitian before specializing in sports nutrition, and she brings that clinical rigor to a space that's usually dominated by fads. No detoxes, no supplement stacks sold on commission — just a plan built around what a member's training actually demands and what their life can actually sustain.",
			"She works closely with Marcus and Alina on shared clients, syncing meal timing to programming so nutrition support isn't a bolt-on afterthought. Members describe her coaching as the thing that finally made their training results consistent, rather than the two-steps-forward-one-back cycle they were used to.",
		],
		certifications: [
			"Registered Dietitian (RD)",
			"CSSD — Board Certified Specialist in Sports Dietetics",
			"Precision Nutrition Level 1 Certification",
		],
		specialties: ["Sports Nutrition", "Sustainable Meal Planning", "Body Recomposition"],
		philosophy: "The best nutrition plan is boring enough that you'll actually follow it in six months.",
	},
];
