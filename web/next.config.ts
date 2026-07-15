import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	// The repo root (one level up) has its own package-lock.json for the
	// static-site tooling; without this, Next.js infers the wrong
	// workspace root since it walks up looking for the nearest lockfile.
	turbopack: {
		root: path.join(__dirname),
	},
};

export default nextConfig;
