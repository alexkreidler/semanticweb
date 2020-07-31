// Use Rust-style explicit error handling
import { ok, err, ResultAsync, Result } from "neverthrow";

type Empty = {};

type IOErrror = {};

type ConfigError = {};

interface APIFrontend {
  confiugure(config: any): ConfigError;
  start(): ResultAsync<Empty, IOErrror>;
  stop(): ResultAsync<Empty, IOErrror>;
}

interface QueryService {
  registerFrontend(f: APIFrontend): Result<Empty, ConfigError>;
  startFrontends(): ResultAsync<Empty, IOErrror>;
}
