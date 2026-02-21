const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();

const DEFAULT_PUBLIC_DNS = ["1.1.1.1", "8.8.8.8"];

const { MONGODB_URI, MONGODB_DB = "voicebite", MONGODB_DNS_SERVERS } =
  process.env;

const parseDnsList = (value = "") =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

let dnsOverrideState = "none"; // none | env | fallback
let hasRetriedWithFallback = false;

const applyDnsServers = (servers, reason, state) => {
  if (!servers.length || dnsOverrideState === state) {
    return dnsOverrideState === state;
  }

  try {
    dns.setServers(servers);
    dnsOverrideState = state;

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[MongoDB] ${reason} Using DNS servers: ${servers.join(", ")}`
      );
    }
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Failed to set DNS servers: ${error.message}`);
    return false;
  }
};

const userDefinedServers = parseDnsList(MONGODB_DNS_SERVERS);
if (userDefinedServers.length) {
  applyDnsServers(userDefinedServers, "Applying user-specified DNS.", "env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const shouldRetrySrvLookup = (error) =>
  error?.code === "ECONNREFUSED" && error?.syscall === "querySrv";

const attemptConnection = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not defined in environment variables");
  }

  try {
    return await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
    });
  } catch (error) {
    if (
      shouldRetrySrvLookup(error) &&
      !hasRetriedWithFallback &&
      dnsOverrideState !== "env" &&
      applyDnsServers(
        userDefinedServers.length ? userDefinedServers : DEFAULT_PUBLIC_DNS,
        "SRV lookup failed via default resolver. Retrying with fallback DNS.",
        "fallback"
      )
    ) {
      hasRetriedWithFallback = true;
      return mongoose.connect(MONGODB_URI, {
        dbName: MONGODB_DB,
        bufferCommands: false,
      });
    }

    throw error;
  }
};

const connectDB = async () => {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = attemptConnection().catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  cached.conn = await cached.promise;

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "MongoDB connected to:",
      cached.conn?.connection?.db?.databaseName || MONGODB_DB
    );
  }

  return cached.conn;
};

module.exports = connectDB;
