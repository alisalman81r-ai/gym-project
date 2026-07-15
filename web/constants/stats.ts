import { Users, GraduationCap, CalendarDays, Trophy } from "lucide-react";
import type { Stat } from "@/types";

export const STATS: Stat[] = [
	{ id: "members", label: "Members", value: 3200, icon: Users },
	{ id: "trainers", label: "Trainers", value: 18, icon: GraduationCap },
	{ id: "years", label: "Years Experience", value: 12, icon: CalendarDays },
	{ id: "awards", label: "Awards", value: 9, icon: Trophy },
];
