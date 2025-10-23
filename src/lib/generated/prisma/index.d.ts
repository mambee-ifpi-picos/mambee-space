
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Sala
 * 
 */
export type Sala = $Result.DefaultSelection<Prisma.$SalaPayload>
/**
 * Model Espaco
 * 
 */
export type Espaco = $Result.DefaultSelection<Prisma.$EspacoPayload>
/**
 * Model Reserva
 * 
 */
export type Reserva = $Result.DefaultSelection<Prisma.$ReservaPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Usuarios
 * const usuarios = await prisma.usuario.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Usuarios
   * const usuarios = await prisma.usuario.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sala`: Exposes CRUD operations for the **Sala** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Salas
    * const salas = await prisma.sala.findMany()
    * ```
    */
  get sala(): Prisma.SalaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.espaco`: Exposes CRUD operations for the **Espaco** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Espacos
    * const espacos = await prisma.espaco.findMany()
    * ```
    */
  get espaco(): Prisma.EspacoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reserva`: Exposes CRUD operations for the **Reserva** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservas
    * const reservas = await prisma.reserva.findMany()
    * ```
    */
  get reserva(): Prisma.ReservaDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.18.0
   * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Usuario: 'Usuario',
    Sala: 'Sala',
    Espaco: 'Espaco',
    Reserva: 'Reserva'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "usuario" | "sala" | "espaco" | "reserva"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Sala: {
        payload: Prisma.$SalaPayload<ExtArgs>
        fields: Prisma.SalaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          findFirst: {
            args: Prisma.SalaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          findMany: {
            args: Prisma.SalaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>[]
          }
          create: {
            args: Prisma.SalaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          createMany: {
            args: Prisma.SalaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>[]
          }
          delete: {
            args: Prisma.SalaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          update: {
            args: Prisma.SalaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          deleteMany: {
            args: Prisma.SalaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SalaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>[]
          }
          upsert: {
            args: Prisma.SalaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaPayload>
          }
          aggregate: {
            args: Prisma.SalaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSala>
          }
          groupBy: {
            args: Prisma.SalaGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalaGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalaCountArgs<ExtArgs>
            result: $Utils.Optional<SalaCountAggregateOutputType> | number
          }
        }
      }
      Espaco: {
        payload: Prisma.$EspacoPayload<ExtArgs>
        fields: Prisma.EspacoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EspacoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EspacoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>
          }
          findFirst: {
            args: Prisma.EspacoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EspacoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>
          }
          findMany: {
            args: Prisma.EspacoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>[]
          }
          create: {
            args: Prisma.EspacoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>
          }
          createMany: {
            args: Prisma.EspacoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EspacoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>[]
          }
          delete: {
            args: Prisma.EspacoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>
          }
          update: {
            args: Prisma.EspacoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>
          }
          deleteMany: {
            args: Prisma.EspacoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EspacoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EspacoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>[]
          }
          upsert: {
            args: Prisma.EspacoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EspacoPayload>
          }
          aggregate: {
            args: Prisma.EspacoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEspaco>
          }
          groupBy: {
            args: Prisma.EspacoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EspacoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EspacoCountArgs<ExtArgs>
            result: $Utils.Optional<EspacoCountAggregateOutputType> | number
          }
        }
      }
      Reserva: {
        payload: Prisma.$ReservaPayload<ExtArgs>
        fields: Prisma.ReservaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          findFirst: {
            args: Prisma.ReservaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          findMany: {
            args: Prisma.ReservaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>[]
          }
          create: {
            args: Prisma.ReservaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          createMany: {
            args: Prisma.ReservaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReservaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>[]
          }
          delete: {
            args: Prisma.ReservaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          update: {
            args: Prisma.ReservaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          deleteMany: {
            args: Prisma.ReservaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReservaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>[]
          }
          upsert: {
            args: Prisma.ReservaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservaPayload>
          }
          aggregate: {
            args: Prisma.ReservaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReserva>
          }
          groupBy: {
            args: Prisma.ReservaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservaCountArgs<ExtArgs>
            result: $Utils.Optional<ReservaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    usuario?: UsuarioOmit
    sala?: SalaOmit
    espaco?: EspacoOmit
    reserva?: ReservaOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsuarioCountOutputType
   */

  export type UsuarioCountOutputType = {
    salasCriadas: number
    espacosCriados: number
    reservasCriadas: number
  }

  export type UsuarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    salasCriadas?: boolean | UsuarioCountOutputTypeCountSalasCriadasArgs
    espacosCriados?: boolean | UsuarioCountOutputTypeCountEspacosCriadosArgs
    reservasCriadas?: boolean | UsuarioCountOutputTypeCountReservasCriadasArgs
  }

  // Custom InputTypes
  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioCountOutputType
     */
    select?: UsuarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountSalasCriadasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalaWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountEspacosCriadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EspacoWhereInput
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountReservasCriadasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservaWhereInput
  }


  /**
   * Count Type SalaCountOutputType
   */

  export type SalaCountOutputType = {
    espacos: number
  }

  export type SalaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    espacos?: boolean | SalaCountOutputTypeCountEspacosArgs
  }

  // Custom InputTypes
  /**
   * SalaCountOutputType without action
   */
  export type SalaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalaCountOutputType
     */
    select?: SalaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SalaCountOutputType without action
   */
  export type SalaCountOutputTypeCountEspacosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EspacoWhereInput
  }


  /**
   * Count Type EspacoCountOutputType
   */

  export type EspacoCountOutputType = {
    reservas: number
  }

  export type EspacoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservas?: boolean | EspacoCountOutputTypeCountReservasArgs
  }

  // Custom InputTypes
  /**
   * EspacoCountOutputType without action
   */
  export type EspacoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EspacoCountOutputType
     */
    select?: EspacoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EspacoCountOutputType without action
   */
  export type EspacoCountOutputTypeCountReservasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    idUsuario: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    idUsuario: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    idUsuario: number | null
    foto: string | null
    email: string | null
    nome: string | null
    admin: boolean | null
  }

  export type UsuarioMaxAggregateOutputType = {
    idUsuario: number | null
    foto: string | null
    email: string | null
    nome: string | null
    admin: boolean | null
  }

  export type UsuarioCountAggregateOutputType = {
    idUsuario: number
    foto: number
    email: number
    nome: number
    admin: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    idUsuario?: true
  }

  export type UsuarioSumAggregateInputType = {
    idUsuario?: true
  }

  export type UsuarioMinAggregateInputType = {
    idUsuario?: true
    foto?: true
    email?: true
    nome?: true
    admin?: true
  }

  export type UsuarioMaxAggregateInputType = {
    idUsuario?: true
    foto?: true
    email?: true
    nome?: true
    admin?: true
  }

  export type UsuarioCountAggregateInputType = {
    idUsuario?: true
    foto?: true
    email?: true
    nome?: true
    admin?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    idUsuario: number
    foto: string | null
    email: string
    nome: string
    admin: boolean
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idUsuario?: boolean
    foto?: boolean
    email?: boolean
    nome?: boolean
    admin?: boolean
    salasCriadas?: boolean | Usuario$salasCriadasArgs<ExtArgs>
    espacosCriados?: boolean | Usuario$espacosCriadosArgs<ExtArgs>
    reservasCriadas?: boolean | Usuario$reservasCriadasArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idUsuario?: boolean
    foto?: boolean
    email?: boolean
    nome?: boolean
    admin?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idUsuario?: boolean
    foto?: boolean
    email?: boolean
    nome?: boolean
    admin?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    idUsuario?: boolean
    foto?: boolean
    email?: boolean
    nome?: boolean
    admin?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idUsuario" | "foto" | "email" | "nome" | "admin", ExtArgs["result"]["usuario"]>
  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    salasCriadas?: boolean | Usuario$salasCriadasArgs<ExtArgs>
    espacosCriados?: boolean | Usuario$espacosCriadosArgs<ExtArgs>
    reservasCriadas?: boolean | Usuario$reservasCriadasArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      salasCriadas: Prisma.$SalaPayload<ExtArgs>[]
      espacosCriados: Prisma.$EspacoPayload<ExtArgs>[]
      reservasCriadas: Prisma.$ReservaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idUsuario: number
      foto: string | null
      email: string
      nome: string
      admin: boolean
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `idUsuario`
     * const usuarioWithIdUsuarioOnly = await prisma.usuario.findMany({ select: { idUsuario: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `idUsuario`
     * const usuarioWithIdUsuarioOnly = await prisma.usuario.createManyAndReturn({
     *   select: { idUsuario: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {UsuarioUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `idUsuario`
     * const usuarioWithIdUsuarioOnly = await prisma.usuario.updateManyAndReturn({
     *   select: { idUsuario: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    salasCriadas<T extends Usuario$salasCriadasArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$salasCriadasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    espacosCriados<T extends Usuario$espacosCriadosArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$espacosCriadosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reservasCriadas<T extends Usuario$reservasCriadasArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$reservasCriadasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly idUsuario: FieldRef<"Usuario", 'Int'>
    readonly foto: FieldRef<"Usuario", 'String'>
    readonly email: FieldRef<"Usuario", 'String'>
    readonly nome: FieldRef<"Usuario", 'String'>
    readonly admin: FieldRef<"Usuario", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario updateManyAndReturn
   */
  export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario.salasCriadas
   */
  export type Usuario$salasCriadasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    where?: SalaWhereInput
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    cursor?: SalaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Usuario.espacosCriados
   */
  export type Usuario$espacosCriadosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    where?: EspacoWhereInput
    orderBy?: EspacoOrderByWithRelationInput | EspacoOrderByWithRelationInput[]
    cursor?: EspacoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EspacoScalarFieldEnum | EspacoScalarFieldEnum[]
  }

  /**
   * Usuario.reservasCriadas
   */
  export type Usuario$reservasCriadasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    where?: ReservaWhereInput
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    cursor?: ReservaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Sala
   */

  export type AggregateSala = {
    _count: SalaCountAggregateOutputType | null
    _avg: SalaAvgAggregateOutputType | null
    _sum: SalaSumAggregateOutputType | null
    _min: SalaMinAggregateOutputType | null
    _max: SalaMaxAggregateOutputType | null
  }

  export type SalaAvgAggregateOutputType = {
    idSala: number | null
    limiteHorasReserva: number | null
    idUsuarioCriador: number | null
  }

  export type SalaSumAggregateOutputType = {
    idSala: number | null
    limiteHorasReserva: number | null
    idUsuarioCriador: number | null
  }

  export type SalaMinAggregateOutputType = {
    idSala: number | null
    nomeSala: string | null
    mapa: string | null
    limiteHorasReserva: number | null
    ativa: boolean | null
    idUsuarioCriador: number | null
  }

  export type SalaMaxAggregateOutputType = {
    idSala: number | null
    nomeSala: string | null
    mapa: string | null
    limiteHorasReserva: number | null
    ativa: boolean | null
    idUsuarioCriador: number | null
  }

  export type SalaCountAggregateOutputType = {
    idSala: number
    nomeSala: number
    mapa: number
    limiteHorasReserva: number
    ativa: number
    idUsuarioCriador: number
    _all: number
  }


  export type SalaAvgAggregateInputType = {
    idSala?: true
    limiteHorasReserva?: true
    idUsuarioCriador?: true
  }

  export type SalaSumAggregateInputType = {
    idSala?: true
    limiteHorasReserva?: true
    idUsuarioCriador?: true
  }

  export type SalaMinAggregateInputType = {
    idSala?: true
    nomeSala?: true
    mapa?: true
    limiteHorasReserva?: true
    ativa?: true
    idUsuarioCriador?: true
  }

  export type SalaMaxAggregateInputType = {
    idSala?: true
    nomeSala?: true
    mapa?: true
    limiteHorasReserva?: true
    ativa?: true
    idUsuarioCriador?: true
  }

  export type SalaCountAggregateInputType = {
    idSala?: true
    nomeSala?: true
    mapa?: true
    limiteHorasReserva?: true
    ativa?: true
    idUsuarioCriador?: true
    _all?: true
  }

  export type SalaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sala to aggregate.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Salas
    **/
    _count?: true | SalaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SalaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SalaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalaMaxAggregateInputType
  }

  export type GetSalaAggregateType<T extends SalaAggregateArgs> = {
        [P in keyof T & keyof AggregateSala]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSala[P]>
      : GetScalarType<T[P], AggregateSala[P]>
  }




  export type SalaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalaWhereInput
    orderBy?: SalaOrderByWithAggregationInput | SalaOrderByWithAggregationInput[]
    by: SalaScalarFieldEnum[] | SalaScalarFieldEnum
    having?: SalaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalaCountAggregateInputType | true
    _avg?: SalaAvgAggregateInputType
    _sum?: SalaSumAggregateInputType
    _min?: SalaMinAggregateInputType
    _max?: SalaMaxAggregateInputType
  }

  export type SalaGroupByOutputType = {
    idSala: number
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa: boolean
    idUsuarioCriador: number
    _count: SalaCountAggregateOutputType | null
    _avg: SalaAvgAggregateOutputType | null
    _sum: SalaSumAggregateOutputType | null
    _min: SalaMinAggregateOutputType | null
    _max: SalaMaxAggregateOutputType | null
  }

  type GetSalaGroupByPayload<T extends SalaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalaGroupByOutputType[P]>
            : GetScalarType<T[P], SalaGroupByOutputType[P]>
        }
      >
    >


  export type SalaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSala?: boolean
    nomeSala?: boolean
    mapa?: boolean
    limiteHorasReserva?: boolean
    ativa?: boolean
    idUsuarioCriador?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espacos?: boolean | Sala$espacosArgs<ExtArgs>
    _count?: boolean | SalaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sala"]>

  export type SalaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSala?: boolean
    nomeSala?: boolean
    mapa?: boolean
    limiteHorasReserva?: boolean
    ativa?: boolean
    idUsuarioCriador?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sala"]>

  export type SalaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSala?: boolean
    nomeSala?: boolean
    mapa?: boolean
    limiteHorasReserva?: boolean
    ativa?: boolean
    idUsuarioCriador?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sala"]>

  export type SalaSelectScalar = {
    idSala?: boolean
    nomeSala?: boolean
    mapa?: boolean
    limiteHorasReserva?: boolean
    ativa?: boolean
    idUsuarioCriador?: boolean
  }

  export type SalaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idSala" | "nomeSala" | "mapa" | "limiteHorasReserva" | "ativa" | "idUsuarioCriador", ExtArgs["result"]["sala"]>
  export type SalaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espacos?: boolean | Sala$espacosArgs<ExtArgs>
    _count?: boolean | SalaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SalaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
  }
  export type SalaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
  }

  export type $SalaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Sala"
    objects: {
      criador: Prisma.$UsuarioPayload<ExtArgs>
      espacos: Prisma.$EspacoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idSala: number
      nomeSala: string
      mapa: string
      limiteHorasReserva: number
      ativa: boolean
      idUsuarioCriador: number
    }, ExtArgs["result"]["sala"]>
    composites: {}
  }

  type SalaGetPayload<S extends boolean | null | undefined | SalaDefaultArgs> = $Result.GetResult<Prisma.$SalaPayload, S>

  type SalaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SalaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SalaCountAggregateInputType | true
    }

  export interface SalaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Sala'], meta: { name: 'Sala' } }
    /**
     * Find zero or one Sala that matches the filter.
     * @param {SalaFindUniqueArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalaFindUniqueArgs>(args: SelectSubset<T, SalaFindUniqueArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sala that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SalaFindUniqueOrThrowArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalaFindUniqueOrThrowArgs>(args: SelectSubset<T, SalaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sala that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaFindFirstArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalaFindFirstArgs>(args?: SelectSubset<T, SalaFindFirstArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sala that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaFindFirstOrThrowArgs} args - Arguments to find a Sala
     * @example
     * // Get one Sala
     * const sala = await prisma.sala.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalaFindFirstOrThrowArgs>(args?: SelectSubset<T, SalaFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Salas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Salas
     * const salas = await prisma.sala.findMany()
     * 
     * // Get first 10 Salas
     * const salas = await prisma.sala.findMany({ take: 10 })
     * 
     * // Only select the `idSala`
     * const salaWithIdSalaOnly = await prisma.sala.findMany({ select: { idSala: true } })
     * 
     */
    findMany<T extends SalaFindManyArgs>(args?: SelectSubset<T, SalaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sala.
     * @param {SalaCreateArgs} args - Arguments to create a Sala.
     * @example
     * // Create one Sala
     * const Sala = await prisma.sala.create({
     *   data: {
     *     // ... data to create a Sala
     *   }
     * })
     * 
     */
    create<T extends SalaCreateArgs>(args: SelectSubset<T, SalaCreateArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Salas.
     * @param {SalaCreateManyArgs} args - Arguments to create many Salas.
     * @example
     * // Create many Salas
     * const sala = await prisma.sala.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalaCreateManyArgs>(args?: SelectSubset<T, SalaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Salas and returns the data saved in the database.
     * @param {SalaCreateManyAndReturnArgs} args - Arguments to create many Salas.
     * @example
     * // Create many Salas
     * const sala = await prisma.sala.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Salas and only return the `idSala`
     * const salaWithIdSalaOnly = await prisma.sala.createManyAndReturn({
     *   select: { idSala: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalaCreateManyAndReturnArgs>(args?: SelectSubset<T, SalaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sala.
     * @param {SalaDeleteArgs} args - Arguments to delete one Sala.
     * @example
     * // Delete one Sala
     * const Sala = await prisma.sala.delete({
     *   where: {
     *     // ... filter to delete one Sala
     *   }
     * })
     * 
     */
    delete<T extends SalaDeleteArgs>(args: SelectSubset<T, SalaDeleteArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sala.
     * @param {SalaUpdateArgs} args - Arguments to update one Sala.
     * @example
     * // Update one Sala
     * const sala = await prisma.sala.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalaUpdateArgs>(args: SelectSubset<T, SalaUpdateArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Salas.
     * @param {SalaDeleteManyArgs} args - Arguments to filter Salas to delete.
     * @example
     * // Delete a few Salas
     * const { count } = await prisma.sala.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalaDeleteManyArgs>(args?: SelectSubset<T, SalaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Salas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Salas
     * const sala = await prisma.sala.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalaUpdateManyArgs>(args: SelectSubset<T, SalaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Salas and returns the data updated in the database.
     * @param {SalaUpdateManyAndReturnArgs} args - Arguments to update many Salas.
     * @example
     * // Update many Salas
     * const sala = await prisma.sala.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Salas and only return the `idSala`
     * const salaWithIdSalaOnly = await prisma.sala.updateManyAndReturn({
     *   select: { idSala: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SalaUpdateManyAndReturnArgs>(args: SelectSubset<T, SalaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sala.
     * @param {SalaUpsertArgs} args - Arguments to update or create a Sala.
     * @example
     * // Update or create a Sala
     * const sala = await prisma.sala.upsert({
     *   create: {
     *     // ... data to create a Sala
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sala we want to update
     *   }
     * })
     */
    upsert<T extends SalaUpsertArgs>(args: SelectSubset<T, SalaUpsertArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Salas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaCountArgs} args - Arguments to filter Salas to count.
     * @example
     * // Count the number of Salas
     * const count = await prisma.sala.count({
     *   where: {
     *     // ... the filter for the Salas we want to count
     *   }
     * })
    **/
    count<T extends SalaCountArgs>(
      args?: Subset<T, SalaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalaAggregateArgs>(args: Subset<T, SalaAggregateArgs>): Prisma.PrismaPromise<GetSalaAggregateType<T>>

    /**
     * Group by Sala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalaGroupByArgs['orderBy'] }
        : { orderBy?: SalaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Sala model
   */
  readonly fields: SalaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Sala.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    criador<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    espacos<T extends Sala$espacosArgs<ExtArgs> = {}>(args?: Subset<T, Sala$espacosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Sala model
   */
  interface SalaFieldRefs {
    readonly idSala: FieldRef<"Sala", 'Int'>
    readonly nomeSala: FieldRef<"Sala", 'String'>
    readonly mapa: FieldRef<"Sala", 'String'>
    readonly limiteHorasReserva: FieldRef<"Sala", 'Int'>
    readonly ativa: FieldRef<"Sala", 'Boolean'>
    readonly idUsuarioCriador: FieldRef<"Sala", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Sala findUnique
   */
  export type SalaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala findUniqueOrThrow
   */
  export type SalaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala findFirst
   */
  export type SalaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Salas.
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Salas.
     */
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Sala findFirstOrThrow
   */
  export type SalaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Sala to fetch.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Salas.
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Salas.
     */
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Sala findMany
   */
  export type SalaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter, which Salas to fetch.
     */
    where?: SalaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salas to fetch.
     */
    orderBy?: SalaOrderByWithRelationInput | SalaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Salas.
     */
    cursor?: SalaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salas.
     */
    skip?: number
    distinct?: SalaScalarFieldEnum | SalaScalarFieldEnum[]
  }

  /**
   * Sala create
   */
  export type SalaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * The data needed to create a Sala.
     */
    data: XOR<SalaCreateInput, SalaUncheckedCreateInput>
  }

  /**
   * Sala createMany
   */
  export type SalaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Salas.
     */
    data: SalaCreateManyInput | SalaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Sala createManyAndReturn
   */
  export type SalaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * The data used to create many Salas.
     */
    data: SalaCreateManyInput | SalaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sala update
   */
  export type SalaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * The data needed to update a Sala.
     */
    data: XOR<SalaUpdateInput, SalaUncheckedUpdateInput>
    /**
     * Choose, which Sala to update.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala updateMany
   */
  export type SalaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Salas.
     */
    data: XOR<SalaUpdateManyMutationInput, SalaUncheckedUpdateManyInput>
    /**
     * Filter which Salas to update
     */
    where?: SalaWhereInput
    /**
     * Limit how many Salas to update.
     */
    limit?: number
  }

  /**
   * Sala updateManyAndReturn
   */
  export type SalaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * The data used to update Salas.
     */
    data: XOR<SalaUpdateManyMutationInput, SalaUncheckedUpdateManyInput>
    /**
     * Filter which Salas to update
     */
    where?: SalaWhereInput
    /**
     * Limit how many Salas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Sala upsert
   */
  export type SalaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * The filter to search for the Sala to update in case it exists.
     */
    where: SalaWhereUniqueInput
    /**
     * In case the Sala found by the `where` argument doesn't exist, create a new Sala with this data.
     */
    create: XOR<SalaCreateInput, SalaUncheckedCreateInput>
    /**
     * In case the Sala was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalaUpdateInput, SalaUncheckedUpdateInput>
  }

  /**
   * Sala delete
   */
  export type SalaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
    /**
     * Filter which Sala to delete.
     */
    where: SalaWhereUniqueInput
  }

  /**
   * Sala deleteMany
   */
  export type SalaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Salas to delete
     */
    where?: SalaWhereInput
    /**
     * Limit how many Salas to delete.
     */
    limit?: number
  }

  /**
   * Sala.espacos
   */
  export type Sala$espacosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    where?: EspacoWhereInput
    orderBy?: EspacoOrderByWithRelationInput | EspacoOrderByWithRelationInput[]
    cursor?: EspacoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EspacoScalarFieldEnum | EspacoScalarFieldEnum[]
  }

  /**
   * Sala without action
   */
  export type SalaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Sala
     */
    select?: SalaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Sala
     */
    omit?: SalaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalaInclude<ExtArgs> | null
  }


  /**
   * Model Espaco
   */

  export type AggregateEspaco = {
    _count: EspacoCountAggregateOutputType | null
    _avg: EspacoAvgAggregateOutputType | null
    _sum: EspacoSumAggregateOutputType | null
    _min: EspacoMinAggregateOutputType | null
    _max: EspacoMaxAggregateOutputType | null
  }

  export type EspacoAvgAggregateOutputType = {
    idEspaco: number | null
    idUsuarioCriador: number | null
    idSalaPertence: number | null
  }

  export type EspacoSumAggregateOutputType = {
    idEspaco: number | null
    idUsuarioCriador: number | null
    idSalaPertence: number | null
  }

  export type EspacoMinAggregateOutputType = {
    idEspaco: number | null
    codigoEspaco: string | null
    idUsuarioCriador: number | null
    idSalaPertence: number | null
  }

  export type EspacoMaxAggregateOutputType = {
    idEspaco: number | null
    codigoEspaco: string | null
    idUsuarioCriador: number | null
    idSalaPertence: number | null
  }

  export type EspacoCountAggregateOutputType = {
    idEspaco: number
    codigoEspaco: number
    idUsuarioCriador: number
    idSalaPertence: number
    _all: number
  }


  export type EspacoAvgAggregateInputType = {
    idEspaco?: true
    idUsuarioCriador?: true
    idSalaPertence?: true
  }

  export type EspacoSumAggregateInputType = {
    idEspaco?: true
    idUsuarioCriador?: true
    idSalaPertence?: true
  }

  export type EspacoMinAggregateInputType = {
    idEspaco?: true
    codigoEspaco?: true
    idUsuarioCriador?: true
    idSalaPertence?: true
  }

  export type EspacoMaxAggregateInputType = {
    idEspaco?: true
    codigoEspaco?: true
    idUsuarioCriador?: true
    idSalaPertence?: true
  }

  export type EspacoCountAggregateInputType = {
    idEspaco?: true
    codigoEspaco?: true
    idUsuarioCriador?: true
    idSalaPertence?: true
    _all?: true
  }

  export type EspacoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Espaco to aggregate.
     */
    where?: EspacoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Espacos to fetch.
     */
    orderBy?: EspacoOrderByWithRelationInput | EspacoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EspacoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Espacos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Espacos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Espacos
    **/
    _count?: true | EspacoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EspacoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EspacoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EspacoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EspacoMaxAggregateInputType
  }

  export type GetEspacoAggregateType<T extends EspacoAggregateArgs> = {
        [P in keyof T & keyof AggregateEspaco]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEspaco[P]>
      : GetScalarType<T[P], AggregateEspaco[P]>
  }




  export type EspacoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EspacoWhereInput
    orderBy?: EspacoOrderByWithAggregationInput | EspacoOrderByWithAggregationInput[]
    by: EspacoScalarFieldEnum[] | EspacoScalarFieldEnum
    having?: EspacoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EspacoCountAggregateInputType | true
    _avg?: EspacoAvgAggregateInputType
    _sum?: EspacoSumAggregateInputType
    _min?: EspacoMinAggregateInputType
    _max?: EspacoMaxAggregateInputType
  }

  export type EspacoGroupByOutputType = {
    idEspaco: number
    codigoEspaco: string
    idUsuarioCriador: number
    idSalaPertence: number
    _count: EspacoCountAggregateOutputType | null
    _avg: EspacoAvgAggregateOutputType | null
    _sum: EspacoSumAggregateOutputType | null
    _min: EspacoMinAggregateOutputType | null
    _max: EspacoMaxAggregateOutputType | null
  }

  type GetEspacoGroupByPayload<T extends EspacoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EspacoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EspacoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EspacoGroupByOutputType[P]>
            : GetScalarType<T[P], EspacoGroupByOutputType[P]>
        }
      >
    >


  export type EspacoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idEspaco?: boolean
    codigoEspaco?: boolean
    idUsuarioCriador?: boolean
    idSalaPertence?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
    reservas?: boolean | Espaco$reservasArgs<ExtArgs>
    _count?: boolean | EspacoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["espaco"]>

  export type EspacoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idEspaco?: boolean
    codigoEspaco?: boolean
    idUsuarioCriador?: boolean
    idSalaPertence?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["espaco"]>

  export type EspacoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idEspaco?: boolean
    codigoEspaco?: boolean
    idUsuarioCriador?: boolean
    idSalaPertence?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["espaco"]>

  export type EspacoSelectScalar = {
    idEspaco?: boolean
    codigoEspaco?: boolean
    idUsuarioCriador?: boolean
    idSalaPertence?: boolean
  }

  export type EspacoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idEspaco" | "codigoEspaco" | "idUsuarioCriador" | "idSalaPertence", ExtArgs["result"]["espaco"]>
  export type EspacoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
    reservas?: boolean | Espaco$reservasArgs<ExtArgs>
    _count?: boolean | EspacoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EspacoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }
  export type EspacoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    sala?: boolean | SalaDefaultArgs<ExtArgs>
  }

  export type $EspacoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Espaco"
    objects: {
      criador: Prisma.$UsuarioPayload<ExtArgs>
      sala: Prisma.$SalaPayload<ExtArgs>
      reservas: Prisma.$ReservaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idEspaco: number
      codigoEspaco: string
      idUsuarioCriador: number
      idSalaPertence: number
    }, ExtArgs["result"]["espaco"]>
    composites: {}
  }

  type EspacoGetPayload<S extends boolean | null | undefined | EspacoDefaultArgs> = $Result.GetResult<Prisma.$EspacoPayload, S>

  type EspacoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EspacoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EspacoCountAggregateInputType | true
    }

  export interface EspacoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Espaco'], meta: { name: 'Espaco' } }
    /**
     * Find zero or one Espaco that matches the filter.
     * @param {EspacoFindUniqueArgs} args - Arguments to find a Espaco
     * @example
     * // Get one Espaco
     * const espaco = await prisma.espaco.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EspacoFindUniqueArgs>(args: SelectSubset<T, EspacoFindUniqueArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Espaco that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EspacoFindUniqueOrThrowArgs} args - Arguments to find a Espaco
     * @example
     * // Get one Espaco
     * const espaco = await prisma.espaco.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EspacoFindUniqueOrThrowArgs>(args: SelectSubset<T, EspacoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Espaco that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspacoFindFirstArgs} args - Arguments to find a Espaco
     * @example
     * // Get one Espaco
     * const espaco = await prisma.espaco.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EspacoFindFirstArgs>(args?: SelectSubset<T, EspacoFindFirstArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Espaco that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspacoFindFirstOrThrowArgs} args - Arguments to find a Espaco
     * @example
     * // Get one Espaco
     * const espaco = await prisma.espaco.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EspacoFindFirstOrThrowArgs>(args?: SelectSubset<T, EspacoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Espacos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspacoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Espacos
     * const espacos = await prisma.espaco.findMany()
     * 
     * // Get first 10 Espacos
     * const espacos = await prisma.espaco.findMany({ take: 10 })
     * 
     * // Only select the `idEspaco`
     * const espacoWithIdEspacoOnly = await prisma.espaco.findMany({ select: { idEspaco: true } })
     * 
     */
    findMany<T extends EspacoFindManyArgs>(args?: SelectSubset<T, EspacoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Espaco.
     * @param {EspacoCreateArgs} args - Arguments to create a Espaco.
     * @example
     * // Create one Espaco
     * const Espaco = await prisma.espaco.create({
     *   data: {
     *     // ... data to create a Espaco
     *   }
     * })
     * 
     */
    create<T extends EspacoCreateArgs>(args: SelectSubset<T, EspacoCreateArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Espacos.
     * @param {EspacoCreateManyArgs} args - Arguments to create many Espacos.
     * @example
     * // Create many Espacos
     * const espaco = await prisma.espaco.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EspacoCreateManyArgs>(args?: SelectSubset<T, EspacoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Espacos and returns the data saved in the database.
     * @param {EspacoCreateManyAndReturnArgs} args - Arguments to create many Espacos.
     * @example
     * // Create many Espacos
     * const espaco = await prisma.espaco.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Espacos and only return the `idEspaco`
     * const espacoWithIdEspacoOnly = await prisma.espaco.createManyAndReturn({
     *   select: { idEspaco: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EspacoCreateManyAndReturnArgs>(args?: SelectSubset<T, EspacoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Espaco.
     * @param {EspacoDeleteArgs} args - Arguments to delete one Espaco.
     * @example
     * // Delete one Espaco
     * const Espaco = await prisma.espaco.delete({
     *   where: {
     *     // ... filter to delete one Espaco
     *   }
     * })
     * 
     */
    delete<T extends EspacoDeleteArgs>(args: SelectSubset<T, EspacoDeleteArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Espaco.
     * @param {EspacoUpdateArgs} args - Arguments to update one Espaco.
     * @example
     * // Update one Espaco
     * const espaco = await prisma.espaco.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EspacoUpdateArgs>(args: SelectSubset<T, EspacoUpdateArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Espacos.
     * @param {EspacoDeleteManyArgs} args - Arguments to filter Espacos to delete.
     * @example
     * // Delete a few Espacos
     * const { count } = await prisma.espaco.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EspacoDeleteManyArgs>(args?: SelectSubset<T, EspacoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Espacos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspacoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Espacos
     * const espaco = await prisma.espaco.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EspacoUpdateManyArgs>(args: SelectSubset<T, EspacoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Espacos and returns the data updated in the database.
     * @param {EspacoUpdateManyAndReturnArgs} args - Arguments to update many Espacos.
     * @example
     * // Update many Espacos
     * const espaco = await prisma.espaco.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Espacos and only return the `idEspaco`
     * const espacoWithIdEspacoOnly = await prisma.espaco.updateManyAndReturn({
     *   select: { idEspaco: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EspacoUpdateManyAndReturnArgs>(args: SelectSubset<T, EspacoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Espaco.
     * @param {EspacoUpsertArgs} args - Arguments to update or create a Espaco.
     * @example
     * // Update or create a Espaco
     * const espaco = await prisma.espaco.upsert({
     *   create: {
     *     // ... data to create a Espaco
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Espaco we want to update
     *   }
     * })
     */
    upsert<T extends EspacoUpsertArgs>(args: SelectSubset<T, EspacoUpsertArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Espacos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspacoCountArgs} args - Arguments to filter Espacos to count.
     * @example
     * // Count the number of Espacos
     * const count = await prisma.espaco.count({
     *   where: {
     *     // ... the filter for the Espacos we want to count
     *   }
     * })
    **/
    count<T extends EspacoCountArgs>(
      args?: Subset<T, EspacoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EspacoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Espaco.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspacoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EspacoAggregateArgs>(args: Subset<T, EspacoAggregateArgs>): Prisma.PrismaPromise<GetEspacoAggregateType<T>>

    /**
     * Group by Espaco.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EspacoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EspacoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EspacoGroupByArgs['orderBy'] }
        : { orderBy?: EspacoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EspacoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEspacoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Espaco model
   */
  readonly fields: EspacoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Espaco.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EspacoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    criador<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sala<T extends SalaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SalaDefaultArgs<ExtArgs>>): Prisma__SalaClient<$Result.GetResult<Prisma.$SalaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reservas<T extends Espaco$reservasArgs<ExtArgs> = {}>(args?: Subset<T, Espaco$reservasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Espaco model
   */
  interface EspacoFieldRefs {
    readonly idEspaco: FieldRef<"Espaco", 'Int'>
    readonly codigoEspaco: FieldRef<"Espaco", 'String'>
    readonly idUsuarioCriador: FieldRef<"Espaco", 'Int'>
    readonly idSalaPertence: FieldRef<"Espaco", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Espaco findUnique
   */
  export type EspacoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * Filter, which Espaco to fetch.
     */
    where: EspacoWhereUniqueInput
  }

  /**
   * Espaco findUniqueOrThrow
   */
  export type EspacoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * Filter, which Espaco to fetch.
     */
    where: EspacoWhereUniqueInput
  }

  /**
   * Espaco findFirst
   */
  export type EspacoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * Filter, which Espaco to fetch.
     */
    where?: EspacoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Espacos to fetch.
     */
    orderBy?: EspacoOrderByWithRelationInput | EspacoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Espacos.
     */
    cursor?: EspacoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Espacos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Espacos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Espacos.
     */
    distinct?: EspacoScalarFieldEnum | EspacoScalarFieldEnum[]
  }

  /**
   * Espaco findFirstOrThrow
   */
  export type EspacoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * Filter, which Espaco to fetch.
     */
    where?: EspacoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Espacos to fetch.
     */
    orderBy?: EspacoOrderByWithRelationInput | EspacoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Espacos.
     */
    cursor?: EspacoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Espacos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Espacos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Espacos.
     */
    distinct?: EspacoScalarFieldEnum | EspacoScalarFieldEnum[]
  }

  /**
   * Espaco findMany
   */
  export type EspacoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * Filter, which Espacos to fetch.
     */
    where?: EspacoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Espacos to fetch.
     */
    orderBy?: EspacoOrderByWithRelationInput | EspacoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Espacos.
     */
    cursor?: EspacoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Espacos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Espacos.
     */
    skip?: number
    distinct?: EspacoScalarFieldEnum | EspacoScalarFieldEnum[]
  }

  /**
   * Espaco create
   */
  export type EspacoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * The data needed to create a Espaco.
     */
    data: XOR<EspacoCreateInput, EspacoUncheckedCreateInput>
  }

  /**
   * Espaco createMany
   */
  export type EspacoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Espacos.
     */
    data: EspacoCreateManyInput | EspacoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Espaco createManyAndReturn
   */
  export type EspacoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * The data used to create many Espacos.
     */
    data: EspacoCreateManyInput | EspacoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Espaco update
   */
  export type EspacoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * The data needed to update a Espaco.
     */
    data: XOR<EspacoUpdateInput, EspacoUncheckedUpdateInput>
    /**
     * Choose, which Espaco to update.
     */
    where: EspacoWhereUniqueInput
  }

  /**
   * Espaco updateMany
   */
  export type EspacoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Espacos.
     */
    data: XOR<EspacoUpdateManyMutationInput, EspacoUncheckedUpdateManyInput>
    /**
     * Filter which Espacos to update
     */
    where?: EspacoWhereInput
    /**
     * Limit how many Espacos to update.
     */
    limit?: number
  }

  /**
   * Espaco updateManyAndReturn
   */
  export type EspacoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * The data used to update Espacos.
     */
    data: XOR<EspacoUpdateManyMutationInput, EspacoUncheckedUpdateManyInput>
    /**
     * Filter which Espacos to update
     */
    where?: EspacoWhereInput
    /**
     * Limit how many Espacos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Espaco upsert
   */
  export type EspacoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * The filter to search for the Espaco to update in case it exists.
     */
    where: EspacoWhereUniqueInput
    /**
     * In case the Espaco found by the `where` argument doesn't exist, create a new Espaco with this data.
     */
    create: XOR<EspacoCreateInput, EspacoUncheckedCreateInput>
    /**
     * In case the Espaco was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EspacoUpdateInput, EspacoUncheckedUpdateInput>
  }

  /**
   * Espaco delete
   */
  export type EspacoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
    /**
     * Filter which Espaco to delete.
     */
    where: EspacoWhereUniqueInput
  }

  /**
   * Espaco deleteMany
   */
  export type EspacoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Espacos to delete
     */
    where?: EspacoWhereInput
    /**
     * Limit how many Espacos to delete.
     */
    limit?: number
  }

  /**
   * Espaco.reservas
   */
  export type Espaco$reservasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    where?: ReservaWhereInput
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    cursor?: ReservaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Espaco without action
   */
  export type EspacoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Espaco
     */
    select?: EspacoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Espaco
     */
    omit?: EspacoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EspacoInclude<ExtArgs> | null
  }


  /**
   * Model Reserva
   */

  export type AggregateReserva = {
    _count: ReservaCountAggregateOutputType | null
    _avg: ReservaAvgAggregateOutputType | null
    _sum: ReservaSumAggregateOutputType | null
    _min: ReservaMinAggregateOutputType | null
    _max: ReservaMaxAggregateOutputType | null
  }

  export type ReservaAvgAggregateOutputType = {
    idReserva: number | null
    idUsuarioCriador: number | null
    idEspacoReservado: number | null
  }

  export type ReservaSumAggregateOutputType = {
    idReserva: number | null
    idUsuarioCriador: number | null
    idEspacoReservado: number | null
  }

  export type ReservaMinAggregateOutputType = {
    idReserva: number | null
    motivo: string | null
    horaInicio: Date | null
    horaFim: Date | null
    situacao: string | null
    idUsuarioCriador: number | null
    idEspacoReservado: number | null
  }

  export type ReservaMaxAggregateOutputType = {
    idReserva: number | null
    motivo: string | null
    horaInicio: Date | null
    horaFim: Date | null
    situacao: string | null
    idUsuarioCriador: number | null
    idEspacoReservado: number | null
  }

  export type ReservaCountAggregateOutputType = {
    idReserva: number
    motivo: number
    horaInicio: number
    horaFim: number
    situacao: number
    idUsuarioCriador: number
    idEspacoReservado: number
    _all: number
  }


  export type ReservaAvgAggregateInputType = {
    idReserva?: true
    idUsuarioCriador?: true
    idEspacoReservado?: true
  }

  export type ReservaSumAggregateInputType = {
    idReserva?: true
    idUsuarioCriador?: true
    idEspacoReservado?: true
  }

  export type ReservaMinAggregateInputType = {
    idReserva?: true
    motivo?: true
    horaInicio?: true
    horaFim?: true
    situacao?: true
    idUsuarioCriador?: true
    idEspacoReservado?: true
  }

  export type ReservaMaxAggregateInputType = {
    idReserva?: true
    motivo?: true
    horaInicio?: true
    horaFim?: true
    situacao?: true
    idUsuarioCriador?: true
    idEspacoReservado?: true
  }

  export type ReservaCountAggregateInputType = {
    idReserva?: true
    motivo?: true
    horaInicio?: true
    horaFim?: true
    situacao?: true
    idUsuarioCriador?: true
    idEspacoReservado?: true
    _all?: true
  }

  export type ReservaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reserva to aggregate.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservas
    **/
    _count?: true | ReservaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReservaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReservaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservaMaxAggregateInputType
  }

  export type GetReservaAggregateType<T extends ReservaAggregateArgs> = {
        [P in keyof T & keyof AggregateReserva]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReserva[P]>
      : GetScalarType<T[P], AggregateReserva[P]>
  }




  export type ReservaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservaWhereInput
    orderBy?: ReservaOrderByWithAggregationInput | ReservaOrderByWithAggregationInput[]
    by: ReservaScalarFieldEnum[] | ReservaScalarFieldEnum
    having?: ReservaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservaCountAggregateInputType | true
    _avg?: ReservaAvgAggregateInputType
    _sum?: ReservaSumAggregateInputType
    _min?: ReservaMinAggregateInputType
    _max?: ReservaMaxAggregateInputType
  }

  export type ReservaGroupByOutputType = {
    idReserva: number
    motivo: string
    horaInicio: Date
    horaFim: Date
    situacao: string
    idUsuarioCriador: number
    idEspacoReservado: number
    _count: ReservaCountAggregateOutputType | null
    _avg: ReservaAvgAggregateOutputType | null
    _sum: ReservaSumAggregateOutputType | null
    _min: ReservaMinAggregateOutputType | null
    _max: ReservaMaxAggregateOutputType | null
  }

  type GetReservaGroupByPayload<T extends ReservaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservaGroupByOutputType[P]>
            : GetScalarType<T[P], ReservaGroupByOutputType[P]>
        }
      >
    >


  export type ReservaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idReserva?: boolean
    motivo?: boolean
    horaInicio?: boolean
    horaFim?: boolean
    situacao?: boolean
    idUsuarioCriador?: boolean
    idEspacoReservado?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espaco?: boolean | EspacoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reserva"]>

  export type ReservaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idReserva?: boolean
    motivo?: boolean
    horaInicio?: boolean
    horaFim?: boolean
    situacao?: boolean
    idUsuarioCriador?: boolean
    idEspacoReservado?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espaco?: boolean | EspacoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reserva"]>

  export type ReservaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idReserva?: boolean
    motivo?: boolean
    horaInicio?: boolean
    horaFim?: boolean
    situacao?: boolean
    idUsuarioCriador?: boolean
    idEspacoReservado?: boolean
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espaco?: boolean | EspacoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reserva"]>

  export type ReservaSelectScalar = {
    idReserva?: boolean
    motivo?: boolean
    horaInicio?: boolean
    horaFim?: boolean
    situacao?: boolean
    idUsuarioCriador?: boolean
    idEspacoReservado?: boolean
  }

  export type ReservaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idReserva" | "motivo" | "horaInicio" | "horaFim" | "situacao" | "idUsuarioCriador" | "idEspacoReservado", ExtArgs["result"]["reserva"]>
  export type ReservaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espaco?: boolean | EspacoDefaultArgs<ExtArgs>
  }
  export type ReservaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espaco?: boolean | EspacoDefaultArgs<ExtArgs>
  }
  export type ReservaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    criador?: boolean | UsuarioDefaultArgs<ExtArgs>
    espaco?: boolean | EspacoDefaultArgs<ExtArgs>
  }

  export type $ReservaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reserva"
    objects: {
      criador: Prisma.$UsuarioPayload<ExtArgs>
      espaco: Prisma.$EspacoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      idReserva: number
      motivo: string
      horaInicio: Date
      horaFim: Date
      situacao: string
      idUsuarioCriador: number
      idEspacoReservado: number
    }, ExtArgs["result"]["reserva"]>
    composites: {}
  }

  type ReservaGetPayload<S extends boolean | null | undefined | ReservaDefaultArgs> = $Result.GetResult<Prisma.$ReservaPayload, S>

  type ReservaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReservaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReservaCountAggregateInputType | true
    }

  export interface ReservaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reserva'], meta: { name: 'Reserva' } }
    /**
     * Find zero or one Reserva that matches the filter.
     * @param {ReservaFindUniqueArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservaFindUniqueArgs>(args: SelectSubset<T, ReservaFindUniqueArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reserva that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReservaFindUniqueOrThrowArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservaFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reserva that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaFindFirstArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservaFindFirstArgs>(args?: SelectSubset<T, ReservaFindFirstArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reserva that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaFindFirstOrThrowArgs} args - Arguments to find a Reserva
     * @example
     * // Get one Reserva
     * const reserva = await prisma.reserva.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservaFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reservas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservas
     * const reservas = await prisma.reserva.findMany()
     * 
     * // Get first 10 Reservas
     * const reservas = await prisma.reserva.findMany({ take: 10 })
     * 
     * // Only select the `idReserva`
     * const reservaWithIdReservaOnly = await prisma.reserva.findMany({ select: { idReserva: true } })
     * 
     */
    findMany<T extends ReservaFindManyArgs>(args?: SelectSubset<T, ReservaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reserva.
     * @param {ReservaCreateArgs} args - Arguments to create a Reserva.
     * @example
     * // Create one Reserva
     * const Reserva = await prisma.reserva.create({
     *   data: {
     *     // ... data to create a Reserva
     *   }
     * })
     * 
     */
    create<T extends ReservaCreateArgs>(args: SelectSubset<T, ReservaCreateArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reservas.
     * @param {ReservaCreateManyArgs} args - Arguments to create many Reservas.
     * @example
     * // Create many Reservas
     * const reserva = await prisma.reserva.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservaCreateManyArgs>(args?: SelectSubset<T, ReservaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reservas and returns the data saved in the database.
     * @param {ReservaCreateManyAndReturnArgs} args - Arguments to create many Reservas.
     * @example
     * // Create many Reservas
     * const reserva = await prisma.reserva.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reservas and only return the `idReserva`
     * const reservaWithIdReservaOnly = await prisma.reserva.createManyAndReturn({
     *   select: { idReserva: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReservaCreateManyAndReturnArgs>(args?: SelectSubset<T, ReservaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reserva.
     * @param {ReservaDeleteArgs} args - Arguments to delete one Reserva.
     * @example
     * // Delete one Reserva
     * const Reserva = await prisma.reserva.delete({
     *   where: {
     *     // ... filter to delete one Reserva
     *   }
     * })
     * 
     */
    delete<T extends ReservaDeleteArgs>(args: SelectSubset<T, ReservaDeleteArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reserva.
     * @param {ReservaUpdateArgs} args - Arguments to update one Reserva.
     * @example
     * // Update one Reserva
     * const reserva = await prisma.reserva.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservaUpdateArgs>(args: SelectSubset<T, ReservaUpdateArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reservas.
     * @param {ReservaDeleteManyArgs} args - Arguments to filter Reservas to delete.
     * @example
     * // Delete a few Reservas
     * const { count } = await prisma.reserva.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservaDeleteManyArgs>(args?: SelectSubset<T, ReservaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservas
     * const reserva = await prisma.reserva.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservaUpdateManyArgs>(args: SelectSubset<T, ReservaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservas and returns the data updated in the database.
     * @param {ReservaUpdateManyAndReturnArgs} args - Arguments to update many Reservas.
     * @example
     * // Update many Reservas
     * const reserva = await prisma.reserva.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reservas and only return the `idReserva`
     * const reservaWithIdReservaOnly = await prisma.reserva.updateManyAndReturn({
     *   select: { idReserva: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReservaUpdateManyAndReturnArgs>(args: SelectSubset<T, ReservaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reserva.
     * @param {ReservaUpsertArgs} args - Arguments to update or create a Reserva.
     * @example
     * // Update or create a Reserva
     * const reserva = await prisma.reserva.upsert({
     *   create: {
     *     // ... data to create a Reserva
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reserva we want to update
     *   }
     * })
     */
    upsert<T extends ReservaUpsertArgs>(args: SelectSubset<T, ReservaUpsertArgs<ExtArgs>>): Prisma__ReservaClient<$Result.GetResult<Prisma.$ReservaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reservas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaCountArgs} args - Arguments to filter Reservas to count.
     * @example
     * // Count the number of Reservas
     * const count = await prisma.reserva.count({
     *   where: {
     *     // ... the filter for the Reservas we want to count
     *   }
     * })
    **/
    count<T extends ReservaCountArgs>(
      args?: Subset<T, ReservaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reserva.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservaAggregateArgs>(args: Subset<T, ReservaAggregateArgs>): Prisma.PrismaPromise<GetReservaAggregateType<T>>

    /**
     * Group by Reserva.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReservaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservaGroupByArgs['orderBy'] }
        : { orderBy?: ReservaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReservaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reserva model
   */
  readonly fields: ReservaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reserva.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    criador<T extends UsuarioDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsuarioDefaultArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    espaco<T extends EspacoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EspacoDefaultArgs<ExtArgs>>): Prisma__EspacoClient<$Result.GetResult<Prisma.$EspacoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reserva model
   */
  interface ReservaFieldRefs {
    readonly idReserva: FieldRef<"Reserva", 'Int'>
    readonly motivo: FieldRef<"Reserva", 'String'>
    readonly horaInicio: FieldRef<"Reserva", 'DateTime'>
    readonly horaFim: FieldRef<"Reserva", 'DateTime'>
    readonly situacao: FieldRef<"Reserva", 'String'>
    readonly idUsuarioCriador: FieldRef<"Reserva", 'Int'>
    readonly idEspacoReservado: FieldRef<"Reserva", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Reserva findUnique
   */
  export type ReservaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva findUniqueOrThrow
   */
  export type ReservaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva findFirst
   */
  export type ReservaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservas.
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservas.
     */
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Reserva findFirstOrThrow
   */
  export type ReservaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reserva to fetch.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservas.
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservas.
     */
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Reserva findMany
   */
  export type ReservaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter, which Reservas to fetch.
     */
    where?: ReservaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservas to fetch.
     */
    orderBy?: ReservaOrderByWithRelationInput | ReservaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservas.
     */
    cursor?: ReservaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservas.
     */
    skip?: number
    distinct?: ReservaScalarFieldEnum | ReservaScalarFieldEnum[]
  }

  /**
   * Reserva create
   */
  export type ReservaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * The data needed to create a Reserva.
     */
    data: XOR<ReservaCreateInput, ReservaUncheckedCreateInput>
  }

  /**
   * Reserva createMany
   */
  export type ReservaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservas.
     */
    data: ReservaCreateManyInput | ReservaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reserva createManyAndReturn
   */
  export type ReservaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * The data used to create many Reservas.
     */
    data: ReservaCreateManyInput | ReservaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reserva update
   */
  export type ReservaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * The data needed to update a Reserva.
     */
    data: XOR<ReservaUpdateInput, ReservaUncheckedUpdateInput>
    /**
     * Choose, which Reserva to update.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva updateMany
   */
  export type ReservaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservas.
     */
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyInput>
    /**
     * Filter which Reservas to update
     */
    where?: ReservaWhereInput
    /**
     * Limit how many Reservas to update.
     */
    limit?: number
  }

  /**
   * Reserva updateManyAndReturn
   */
  export type ReservaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * The data used to update Reservas.
     */
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyInput>
    /**
     * Filter which Reservas to update
     */
    where?: ReservaWhereInput
    /**
     * Limit how many Reservas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Reserva upsert
   */
  export type ReservaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * The filter to search for the Reserva to update in case it exists.
     */
    where: ReservaWhereUniqueInput
    /**
     * In case the Reserva found by the `where` argument doesn't exist, create a new Reserva with this data.
     */
    create: XOR<ReservaCreateInput, ReservaUncheckedCreateInput>
    /**
     * In case the Reserva was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservaUpdateInput, ReservaUncheckedUpdateInput>
  }

  /**
   * Reserva delete
   */
  export type ReservaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
    /**
     * Filter which Reserva to delete.
     */
    where: ReservaWhereUniqueInput
  }

  /**
   * Reserva deleteMany
   */
  export type ReservaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservas to delete
     */
    where?: ReservaWhereInput
    /**
     * Limit how many Reservas to delete.
     */
    limit?: number
  }

  /**
   * Reserva without action
   */
  export type ReservaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reserva
     */
    select?: ReservaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reserva
     */
    omit?: ReservaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservaInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsuarioScalarFieldEnum: {
    idUsuario: 'idUsuario',
    foto: 'foto',
    email: 'email',
    nome: 'nome',
    admin: 'admin'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const SalaScalarFieldEnum: {
    idSala: 'idSala',
    nomeSala: 'nomeSala',
    mapa: 'mapa',
    limiteHorasReserva: 'limiteHorasReserva',
    ativa: 'ativa',
    idUsuarioCriador: 'idUsuarioCriador'
  };

  export type SalaScalarFieldEnum = (typeof SalaScalarFieldEnum)[keyof typeof SalaScalarFieldEnum]


  export const EspacoScalarFieldEnum: {
    idEspaco: 'idEspaco',
    codigoEspaco: 'codigoEspaco',
    idUsuarioCriador: 'idUsuarioCriador',
    idSalaPertence: 'idSalaPertence'
  };

  export type EspacoScalarFieldEnum = (typeof EspacoScalarFieldEnum)[keyof typeof EspacoScalarFieldEnum]


  export const ReservaScalarFieldEnum: {
    idReserva: 'idReserva',
    motivo: 'motivo',
    horaInicio: 'horaInicio',
    horaFim: 'horaFim',
    situacao: 'situacao',
    idUsuarioCriador: 'idUsuarioCriador',
    idEspacoReservado: 'idEspacoReservado'
  };

  export type ReservaScalarFieldEnum = (typeof ReservaScalarFieldEnum)[keyof typeof ReservaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    idUsuario?: IntFilter<"Usuario"> | number
    foto?: StringNullableFilter<"Usuario"> | string | null
    email?: StringFilter<"Usuario"> | string
    nome?: StringFilter<"Usuario"> | string
    admin?: BoolFilter<"Usuario"> | boolean
    salasCriadas?: SalaListRelationFilter
    espacosCriados?: EspacoListRelationFilter
    reservasCriadas?: ReservaListRelationFilter
  }

  export type UsuarioOrderByWithRelationInput = {
    idUsuario?: SortOrder
    foto?: SortOrderInput | SortOrder
    email?: SortOrder
    nome?: SortOrder
    admin?: SortOrder
    salasCriadas?: SalaOrderByRelationAggregateInput
    espacosCriados?: EspacoOrderByRelationAggregateInput
    reservasCriadas?: ReservaOrderByRelationAggregateInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    idUsuario?: number
    email?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    foto?: StringNullableFilter<"Usuario"> | string | null
    nome?: StringFilter<"Usuario"> | string
    admin?: BoolFilter<"Usuario"> | boolean
    salasCriadas?: SalaListRelationFilter
    espacosCriados?: EspacoListRelationFilter
    reservasCriadas?: ReservaListRelationFilter
  }, "idUsuario" | "email">

  export type UsuarioOrderByWithAggregationInput = {
    idUsuario?: SortOrder
    foto?: SortOrderInput | SortOrder
    email?: SortOrder
    nome?: SortOrder
    admin?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    idUsuario?: IntWithAggregatesFilter<"Usuario"> | number
    foto?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    email?: StringWithAggregatesFilter<"Usuario"> | string
    nome?: StringWithAggregatesFilter<"Usuario"> | string
    admin?: BoolWithAggregatesFilter<"Usuario"> | boolean
  }

  export type SalaWhereInput = {
    AND?: SalaWhereInput | SalaWhereInput[]
    OR?: SalaWhereInput[]
    NOT?: SalaWhereInput | SalaWhereInput[]
    idSala?: IntFilter<"Sala"> | number
    nomeSala?: StringFilter<"Sala"> | string
    mapa?: StringFilter<"Sala"> | string
    limiteHorasReserva?: IntFilter<"Sala"> | number
    ativa?: BoolFilter<"Sala"> | boolean
    idUsuarioCriador?: IntFilter<"Sala"> | number
    criador?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    espacos?: EspacoListRelationFilter
  }

  export type SalaOrderByWithRelationInput = {
    idSala?: SortOrder
    nomeSala?: SortOrder
    mapa?: SortOrder
    limiteHorasReserva?: SortOrder
    ativa?: SortOrder
    idUsuarioCriador?: SortOrder
    criador?: UsuarioOrderByWithRelationInput
    espacos?: EspacoOrderByRelationAggregateInput
  }

  export type SalaWhereUniqueInput = Prisma.AtLeast<{
    idSala?: number
    AND?: SalaWhereInput | SalaWhereInput[]
    OR?: SalaWhereInput[]
    NOT?: SalaWhereInput | SalaWhereInput[]
    nomeSala?: StringFilter<"Sala"> | string
    mapa?: StringFilter<"Sala"> | string
    limiteHorasReserva?: IntFilter<"Sala"> | number
    ativa?: BoolFilter<"Sala"> | boolean
    idUsuarioCriador?: IntFilter<"Sala"> | number
    criador?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    espacos?: EspacoListRelationFilter
  }, "idSala">

  export type SalaOrderByWithAggregationInput = {
    idSala?: SortOrder
    nomeSala?: SortOrder
    mapa?: SortOrder
    limiteHorasReserva?: SortOrder
    ativa?: SortOrder
    idUsuarioCriador?: SortOrder
    _count?: SalaCountOrderByAggregateInput
    _avg?: SalaAvgOrderByAggregateInput
    _max?: SalaMaxOrderByAggregateInput
    _min?: SalaMinOrderByAggregateInput
    _sum?: SalaSumOrderByAggregateInput
  }

  export type SalaScalarWhereWithAggregatesInput = {
    AND?: SalaScalarWhereWithAggregatesInput | SalaScalarWhereWithAggregatesInput[]
    OR?: SalaScalarWhereWithAggregatesInput[]
    NOT?: SalaScalarWhereWithAggregatesInput | SalaScalarWhereWithAggregatesInput[]
    idSala?: IntWithAggregatesFilter<"Sala"> | number
    nomeSala?: StringWithAggregatesFilter<"Sala"> | string
    mapa?: StringWithAggregatesFilter<"Sala"> | string
    limiteHorasReserva?: IntWithAggregatesFilter<"Sala"> | number
    ativa?: BoolWithAggregatesFilter<"Sala"> | boolean
    idUsuarioCriador?: IntWithAggregatesFilter<"Sala"> | number
  }

  export type EspacoWhereInput = {
    AND?: EspacoWhereInput | EspacoWhereInput[]
    OR?: EspacoWhereInput[]
    NOT?: EspacoWhereInput | EspacoWhereInput[]
    idEspaco?: IntFilter<"Espaco"> | number
    codigoEspaco?: StringFilter<"Espaco"> | string
    idUsuarioCriador?: IntFilter<"Espaco"> | number
    idSalaPertence?: IntFilter<"Espaco"> | number
    criador?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    sala?: XOR<SalaScalarRelationFilter, SalaWhereInput>
    reservas?: ReservaListRelationFilter
  }

  export type EspacoOrderByWithRelationInput = {
    idEspaco?: SortOrder
    codigoEspaco?: SortOrder
    idUsuarioCriador?: SortOrder
    idSalaPertence?: SortOrder
    criador?: UsuarioOrderByWithRelationInput
    sala?: SalaOrderByWithRelationInput
    reservas?: ReservaOrderByRelationAggregateInput
  }

  export type EspacoWhereUniqueInput = Prisma.AtLeast<{
    idEspaco?: number
    AND?: EspacoWhereInput | EspacoWhereInput[]
    OR?: EspacoWhereInput[]
    NOT?: EspacoWhereInput | EspacoWhereInput[]
    codigoEspaco?: StringFilter<"Espaco"> | string
    idUsuarioCriador?: IntFilter<"Espaco"> | number
    idSalaPertence?: IntFilter<"Espaco"> | number
    criador?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    sala?: XOR<SalaScalarRelationFilter, SalaWhereInput>
    reservas?: ReservaListRelationFilter
  }, "idEspaco">

  export type EspacoOrderByWithAggregationInput = {
    idEspaco?: SortOrder
    codigoEspaco?: SortOrder
    idUsuarioCriador?: SortOrder
    idSalaPertence?: SortOrder
    _count?: EspacoCountOrderByAggregateInput
    _avg?: EspacoAvgOrderByAggregateInput
    _max?: EspacoMaxOrderByAggregateInput
    _min?: EspacoMinOrderByAggregateInput
    _sum?: EspacoSumOrderByAggregateInput
  }

  export type EspacoScalarWhereWithAggregatesInput = {
    AND?: EspacoScalarWhereWithAggregatesInput | EspacoScalarWhereWithAggregatesInput[]
    OR?: EspacoScalarWhereWithAggregatesInput[]
    NOT?: EspacoScalarWhereWithAggregatesInput | EspacoScalarWhereWithAggregatesInput[]
    idEspaco?: IntWithAggregatesFilter<"Espaco"> | number
    codigoEspaco?: StringWithAggregatesFilter<"Espaco"> | string
    idUsuarioCriador?: IntWithAggregatesFilter<"Espaco"> | number
    idSalaPertence?: IntWithAggregatesFilter<"Espaco"> | number
  }

  export type ReservaWhereInput = {
    AND?: ReservaWhereInput | ReservaWhereInput[]
    OR?: ReservaWhereInput[]
    NOT?: ReservaWhereInput | ReservaWhereInput[]
    idReserva?: IntFilter<"Reserva"> | number
    motivo?: StringFilter<"Reserva"> | string
    horaInicio?: DateTimeFilter<"Reserva"> | Date | string
    horaFim?: DateTimeFilter<"Reserva"> | Date | string
    situacao?: StringFilter<"Reserva"> | string
    idUsuarioCriador?: IntFilter<"Reserva"> | number
    idEspacoReservado?: IntFilter<"Reserva"> | number
    criador?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    espaco?: XOR<EspacoScalarRelationFilter, EspacoWhereInput>
  }

  export type ReservaOrderByWithRelationInput = {
    idReserva?: SortOrder
    motivo?: SortOrder
    horaInicio?: SortOrder
    horaFim?: SortOrder
    situacao?: SortOrder
    idUsuarioCriador?: SortOrder
    idEspacoReservado?: SortOrder
    criador?: UsuarioOrderByWithRelationInput
    espaco?: EspacoOrderByWithRelationInput
  }

  export type ReservaWhereUniqueInput = Prisma.AtLeast<{
    idReserva?: number
    AND?: ReservaWhereInput | ReservaWhereInput[]
    OR?: ReservaWhereInput[]
    NOT?: ReservaWhereInput | ReservaWhereInput[]
    motivo?: StringFilter<"Reserva"> | string
    horaInicio?: DateTimeFilter<"Reserva"> | Date | string
    horaFim?: DateTimeFilter<"Reserva"> | Date | string
    situacao?: StringFilter<"Reserva"> | string
    idUsuarioCriador?: IntFilter<"Reserva"> | number
    idEspacoReservado?: IntFilter<"Reserva"> | number
    criador?: XOR<UsuarioScalarRelationFilter, UsuarioWhereInput>
    espaco?: XOR<EspacoScalarRelationFilter, EspacoWhereInput>
  }, "idReserva">

  export type ReservaOrderByWithAggregationInput = {
    idReserva?: SortOrder
    motivo?: SortOrder
    horaInicio?: SortOrder
    horaFim?: SortOrder
    situacao?: SortOrder
    idUsuarioCriador?: SortOrder
    idEspacoReservado?: SortOrder
    _count?: ReservaCountOrderByAggregateInput
    _avg?: ReservaAvgOrderByAggregateInput
    _max?: ReservaMaxOrderByAggregateInput
    _min?: ReservaMinOrderByAggregateInput
    _sum?: ReservaSumOrderByAggregateInput
  }

  export type ReservaScalarWhereWithAggregatesInput = {
    AND?: ReservaScalarWhereWithAggregatesInput | ReservaScalarWhereWithAggregatesInput[]
    OR?: ReservaScalarWhereWithAggregatesInput[]
    NOT?: ReservaScalarWhereWithAggregatesInput | ReservaScalarWhereWithAggregatesInput[]
    idReserva?: IntWithAggregatesFilter<"Reserva"> | number
    motivo?: StringWithAggregatesFilter<"Reserva"> | string
    horaInicio?: DateTimeWithAggregatesFilter<"Reserva"> | Date | string
    horaFim?: DateTimeWithAggregatesFilter<"Reserva"> | Date | string
    situacao?: StringWithAggregatesFilter<"Reserva"> | string
    idUsuarioCriador?: IntWithAggregatesFilter<"Reserva"> | number
    idEspacoReservado?: IntWithAggregatesFilter<"Reserva"> | number
  }

  export type UsuarioCreateInput = {
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    salasCriadas?: SalaCreateNestedManyWithoutCriadorInput
    espacosCriados?: EspacoCreateNestedManyWithoutCriadorInput
    reservasCriadas?: ReservaCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioUncheckedCreateInput = {
    idUsuario?: number
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    salasCriadas?: SalaUncheckedCreateNestedManyWithoutCriadorInput
    espacosCriados?: EspacoUncheckedCreateNestedManyWithoutCriadorInput
    reservasCriadas?: ReservaUncheckedCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioUpdateInput = {
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    salasCriadas?: SalaUpdateManyWithoutCriadorNestedInput
    espacosCriados?: EspacoUpdateManyWithoutCriadorNestedInput
    reservasCriadas?: ReservaUpdateManyWithoutCriadorNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    idUsuario?: IntFieldUpdateOperationsInput | number
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    salasCriadas?: SalaUncheckedUpdateManyWithoutCriadorNestedInput
    espacosCriados?: EspacoUncheckedUpdateManyWithoutCriadorNestedInput
    reservasCriadas?: ReservaUncheckedUpdateManyWithoutCriadorNestedInput
  }

  export type UsuarioCreateManyInput = {
    idUsuario?: number
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
  }

  export type UsuarioUpdateManyMutationInput = {
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UsuarioUncheckedUpdateManyInput = {
    idUsuario?: IntFieldUpdateOperationsInput | number
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SalaCreateInput = {
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
    criador: UsuarioCreateNestedOneWithoutSalasCriadasInput
    espacos?: EspacoCreateNestedManyWithoutSalaInput
  }

  export type SalaUncheckedCreateInput = {
    idSala?: number
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
    idUsuarioCriador: number
    espacos?: EspacoUncheckedCreateNestedManyWithoutSalaInput
  }

  export type SalaUpdateInput = {
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criador?: UsuarioUpdateOneRequiredWithoutSalasCriadasNestedInput
    espacos?: EspacoUpdateManyWithoutSalaNestedInput
  }

  export type SalaUncheckedUpdateInput = {
    idSala?: IntFieldUpdateOperationsInput | number
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
    espacos?: EspacoUncheckedUpdateManyWithoutSalaNestedInput
  }

  export type SalaCreateManyInput = {
    idSala?: number
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
    idUsuarioCriador: number
  }

  export type SalaUpdateManyMutationInput = {
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SalaUncheckedUpdateManyInput = {
    idSala?: IntFieldUpdateOperationsInput | number
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
  }

  export type EspacoCreateInput = {
    codigoEspaco: string
    criador: UsuarioCreateNestedOneWithoutEspacosCriadosInput
    sala: SalaCreateNestedOneWithoutEspacosInput
    reservas?: ReservaCreateNestedManyWithoutEspacoInput
  }

  export type EspacoUncheckedCreateInput = {
    idEspaco?: number
    codigoEspaco: string
    idUsuarioCriador: number
    idSalaPertence: number
    reservas?: ReservaUncheckedCreateNestedManyWithoutEspacoInput
  }

  export type EspacoUpdateInput = {
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    criador?: UsuarioUpdateOneRequiredWithoutEspacosCriadosNestedInput
    sala?: SalaUpdateOneRequiredWithoutEspacosNestedInput
    reservas?: ReservaUpdateManyWithoutEspacoNestedInput
  }

  export type EspacoUncheckedUpdateInput = {
    idEspaco?: IntFieldUpdateOperationsInput | number
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
    idSalaPertence?: IntFieldUpdateOperationsInput | number
    reservas?: ReservaUncheckedUpdateManyWithoutEspacoNestedInput
  }

  export type EspacoCreateManyInput = {
    idEspaco?: number
    codigoEspaco: string
    idUsuarioCriador: number
    idSalaPertence: number
  }

  export type EspacoUpdateManyMutationInput = {
    codigoEspaco?: StringFieldUpdateOperationsInput | string
  }

  export type EspacoUncheckedUpdateManyInput = {
    idEspaco?: IntFieldUpdateOperationsInput | number
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
    idSalaPertence?: IntFieldUpdateOperationsInput | number
  }

  export type ReservaCreateInput = {
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    criador: UsuarioCreateNestedOneWithoutReservasCriadasInput
    espaco: EspacoCreateNestedOneWithoutReservasInput
  }

  export type ReservaUncheckedCreateInput = {
    idReserva?: number
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    idUsuarioCriador: number
    idEspacoReservado: number
  }

  export type ReservaUpdateInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    criador?: UsuarioUpdateOneRequiredWithoutReservasCriadasNestedInput
    espaco?: EspacoUpdateOneRequiredWithoutReservasNestedInput
  }

  export type ReservaUncheckedUpdateInput = {
    idReserva?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
    idEspacoReservado?: IntFieldUpdateOperationsInput | number
  }

  export type ReservaCreateManyInput = {
    idReserva?: number
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    idUsuarioCriador: number
    idEspacoReservado: number
  }

  export type ReservaUpdateManyMutationInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
  }

  export type ReservaUncheckedUpdateManyInput = {
    idReserva?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
    idEspacoReservado?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SalaListRelationFilter = {
    every?: SalaWhereInput
    some?: SalaWhereInput
    none?: SalaWhereInput
  }

  export type EspacoListRelationFilter = {
    every?: EspacoWhereInput
    some?: EspacoWhereInput
    none?: EspacoWhereInput
  }

  export type ReservaListRelationFilter = {
    every?: ReservaWhereInput
    some?: ReservaWhereInput
    none?: ReservaWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SalaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EspacoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReservaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsuarioCountOrderByAggregateInput = {
    idUsuario?: SortOrder
    foto?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    admin?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    idUsuario?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    idUsuario?: SortOrder
    foto?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    admin?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    idUsuario?: SortOrder
    foto?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    admin?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    idUsuario?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UsuarioScalarRelationFilter = {
    is?: UsuarioWhereInput
    isNot?: UsuarioWhereInput
  }

  export type SalaCountOrderByAggregateInput = {
    idSala?: SortOrder
    nomeSala?: SortOrder
    mapa?: SortOrder
    limiteHorasReserva?: SortOrder
    ativa?: SortOrder
    idUsuarioCriador?: SortOrder
  }

  export type SalaAvgOrderByAggregateInput = {
    idSala?: SortOrder
    limiteHorasReserva?: SortOrder
    idUsuarioCriador?: SortOrder
  }

  export type SalaMaxOrderByAggregateInput = {
    idSala?: SortOrder
    nomeSala?: SortOrder
    mapa?: SortOrder
    limiteHorasReserva?: SortOrder
    ativa?: SortOrder
    idUsuarioCriador?: SortOrder
  }

  export type SalaMinOrderByAggregateInput = {
    idSala?: SortOrder
    nomeSala?: SortOrder
    mapa?: SortOrder
    limiteHorasReserva?: SortOrder
    ativa?: SortOrder
    idUsuarioCriador?: SortOrder
  }

  export type SalaSumOrderByAggregateInput = {
    idSala?: SortOrder
    limiteHorasReserva?: SortOrder
    idUsuarioCriador?: SortOrder
  }

  export type SalaScalarRelationFilter = {
    is?: SalaWhereInput
    isNot?: SalaWhereInput
  }

  export type EspacoCountOrderByAggregateInput = {
    idEspaco?: SortOrder
    codigoEspaco?: SortOrder
    idUsuarioCriador?: SortOrder
    idSalaPertence?: SortOrder
  }

  export type EspacoAvgOrderByAggregateInput = {
    idEspaco?: SortOrder
    idUsuarioCriador?: SortOrder
    idSalaPertence?: SortOrder
  }

  export type EspacoMaxOrderByAggregateInput = {
    idEspaco?: SortOrder
    codigoEspaco?: SortOrder
    idUsuarioCriador?: SortOrder
    idSalaPertence?: SortOrder
  }

  export type EspacoMinOrderByAggregateInput = {
    idEspaco?: SortOrder
    codigoEspaco?: SortOrder
    idUsuarioCriador?: SortOrder
    idSalaPertence?: SortOrder
  }

  export type EspacoSumOrderByAggregateInput = {
    idEspaco?: SortOrder
    idUsuarioCriador?: SortOrder
    idSalaPertence?: SortOrder
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EspacoScalarRelationFilter = {
    is?: EspacoWhereInput
    isNot?: EspacoWhereInput
  }

  export type ReservaCountOrderByAggregateInput = {
    idReserva?: SortOrder
    motivo?: SortOrder
    horaInicio?: SortOrder
    horaFim?: SortOrder
    situacao?: SortOrder
    idUsuarioCriador?: SortOrder
    idEspacoReservado?: SortOrder
  }

  export type ReservaAvgOrderByAggregateInput = {
    idReserva?: SortOrder
    idUsuarioCriador?: SortOrder
    idEspacoReservado?: SortOrder
  }

  export type ReservaMaxOrderByAggregateInput = {
    idReserva?: SortOrder
    motivo?: SortOrder
    horaInicio?: SortOrder
    horaFim?: SortOrder
    situacao?: SortOrder
    idUsuarioCriador?: SortOrder
    idEspacoReservado?: SortOrder
  }

  export type ReservaMinOrderByAggregateInput = {
    idReserva?: SortOrder
    motivo?: SortOrder
    horaInicio?: SortOrder
    horaFim?: SortOrder
    situacao?: SortOrder
    idUsuarioCriador?: SortOrder
    idEspacoReservado?: SortOrder
  }

  export type ReservaSumOrderByAggregateInput = {
    idReserva?: SortOrder
    idUsuarioCriador?: SortOrder
    idEspacoReservado?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SalaCreateNestedManyWithoutCriadorInput = {
    create?: XOR<SalaCreateWithoutCriadorInput, SalaUncheckedCreateWithoutCriadorInput> | SalaCreateWithoutCriadorInput[] | SalaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutCriadorInput | SalaCreateOrConnectWithoutCriadorInput[]
    createMany?: SalaCreateManyCriadorInputEnvelope
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
  }

  export type EspacoCreateNestedManyWithoutCriadorInput = {
    create?: XOR<EspacoCreateWithoutCriadorInput, EspacoUncheckedCreateWithoutCriadorInput> | EspacoCreateWithoutCriadorInput[] | EspacoUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutCriadorInput | EspacoCreateOrConnectWithoutCriadorInput[]
    createMany?: EspacoCreateManyCriadorInputEnvelope
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
  }

  export type ReservaCreateNestedManyWithoutCriadorInput = {
    create?: XOR<ReservaCreateWithoutCriadorInput, ReservaUncheckedCreateWithoutCriadorInput> | ReservaCreateWithoutCriadorInput[] | ReservaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutCriadorInput | ReservaCreateOrConnectWithoutCriadorInput[]
    createMany?: ReservaCreateManyCriadorInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type SalaUncheckedCreateNestedManyWithoutCriadorInput = {
    create?: XOR<SalaCreateWithoutCriadorInput, SalaUncheckedCreateWithoutCriadorInput> | SalaCreateWithoutCriadorInput[] | SalaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutCriadorInput | SalaCreateOrConnectWithoutCriadorInput[]
    createMany?: SalaCreateManyCriadorInputEnvelope
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
  }

  export type EspacoUncheckedCreateNestedManyWithoutCriadorInput = {
    create?: XOR<EspacoCreateWithoutCriadorInput, EspacoUncheckedCreateWithoutCriadorInput> | EspacoCreateWithoutCriadorInput[] | EspacoUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutCriadorInput | EspacoCreateOrConnectWithoutCriadorInput[]
    createMany?: EspacoCreateManyCriadorInputEnvelope
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
  }

  export type ReservaUncheckedCreateNestedManyWithoutCriadorInput = {
    create?: XOR<ReservaCreateWithoutCriadorInput, ReservaUncheckedCreateWithoutCriadorInput> | ReservaCreateWithoutCriadorInput[] | ReservaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutCriadorInput | ReservaCreateOrConnectWithoutCriadorInput[]
    createMany?: ReservaCreateManyCriadorInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SalaUpdateManyWithoutCriadorNestedInput = {
    create?: XOR<SalaCreateWithoutCriadorInput, SalaUncheckedCreateWithoutCriadorInput> | SalaCreateWithoutCriadorInput[] | SalaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutCriadorInput | SalaCreateOrConnectWithoutCriadorInput[]
    upsert?: SalaUpsertWithWhereUniqueWithoutCriadorInput | SalaUpsertWithWhereUniqueWithoutCriadorInput[]
    createMany?: SalaCreateManyCriadorInputEnvelope
    set?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    disconnect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    delete?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    update?: SalaUpdateWithWhereUniqueWithoutCriadorInput | SalaUpdateWithWhereUniqueWithoutCriadorInput[]
    updateMany?: SalaUpdateManyWithWhereWithoutCriadorInput | SalaUpdateManyWithWhereWithoutCriadorInput[]
    deleteMany?: SalaScalarWhereInput | SalaScalarWhereInput[]
  }

  export type EspacoUpdateManyWithoutCriadorNestedInput = {
    create?: XOR<EspacoCreateWithoutCriadorInput, EspacoUncheckedCreateWithoutCriadorInput> | EspacoCreateWithoutCriadorInput[] | EspacoUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutCriadorInput | EspacoCreateOrConnectWithoutCriadorInput[]
    upsert?: EspacoUpsertWithWhereUniqueWithoutCriadorInput | EspacoUpsertWithWhereUniqueWithoutCriadorInput[]
    createMany?: EspacoCreateManyCriadorInputEnvelope
    set?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    disconnect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    delete?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    update?: EspacoUpdateWithWhereUniqueWithoutCriadorInput | EspacoUpdateWithWhereUniqueWithoutCriadorInput[]
    updateMany?: EspacoUpdateManyWithWhereWithoutCriadorInput | EspacoUpdateManyWithWhereWithoutCriadorInput[]
    deleteMany?: EspacoScalarWhereInput | EspacoScalarWhereInput[]
  }

  export type ReservaUpdateManyWithoutCriadorNestedInput = {
    create?: XOR<ReservaCreateWithoutCriadorInput, ReservaUncheckedCreateWithoutCriadorInput> | ReservaCreateWithoutCriadorInput[] | ReservaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutCriadorInput | ReservaCreateOrConnectWithoutCriadorInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutCriadorInput | ReservaUpsertWithWhereUniqueWithoutCriadorInput[]
    createMany?: ReservaCreateManyCriadorInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutCriadorInput | ReservaUpdateWithWhereUniqueWithoutCriadorInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutCriadorInput | ReservaUpdateManyWithWhereWithoutCriadorInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SalaUncheckedUpdateManyWithoutCriadorNestedInput = {
    create?: XOR<SalaCreateWithoutCriadorInput, SalaUncheckedCreateWithoutCriadorInput> | SalaCreateWithoutCriadorInput[] | SalaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: SalaCreateOrConnectWithoutCriadorInput | SalaCreateOrConnectWithoutCriadorInput[]
    upsert?: SalaUpsertWithWhereUniqueWithoutCriadorInput | SalaUpsertWithWhereUniqueWithoutCriadorInput[]
    createMany?: SalaCreateManyCriadorInputEnvelope
    set?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    disconnect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    delete?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    connect?: SalaWhereUniqueInput | SalaWhereUniqueInput[]
    update?: SalaUpdateWithWhereUniqueWithoutCriadorInput | SalaUpdateWithWhereUniqueWithoutCriadorInput[]
    updateMany?: SalaUpdateManyWithWhereWithoutCriadorInput | SalaUpdateManyWithWhereWithoutCriadorInput[]
    deleteMany?: SalaScalarWhereInput | SalaScalarWhereInput[]
  }

  export type EspacoUncheckedUpdateManyWithoutCriadorNestedInput = {
    create?: XOR<EspacoCreateWithoutCriadorInput, EspacoUncheckedCreateWithoutCriadorInput> | EspacoCreateWithoutCriadorInput[] | EspacoUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutCriadorInput | EspacoCreateOrConnectWithoutCriadorInput[]
    upsert?: EspacoUpsertWithWhereUniqueWithoutCriadorInput | EspacoUpsertWithWhereUniqueWithoutCriadorInput[]
    createMany?: EspacoCreateManyCriadorInputEnvelope
    set?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    disconnect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    delete?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    update?: EspacoUpdateWithWhereUniqueWithoutCriadorInput | EspacoUpdateWithWhereUniqueWithoutCriadorInput[]
    updateMany?: EspacoUpdateManyWithWhereWithoutCriadorInput | EspacoUpdateManyWithWhereWithoutCriadorInput[]
    deleteMany?: EspacoScalarWhereInput | EspacoScalarWhereInput[]
  }

  export type ReservaUncheckedUpdateManyWithoutCriadorNestedInput = {
    create?: XOR<ReservaCreateWithoutCriadorInput, ReservaUncheckedCreateWithoutCriadorInput> | ReservaCreateWithoutCriadorInput[] | ReservaUncheckedCreateWithoutCriadorInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutCriadorInput | ReservaCreateOrConnectWithoutCriadorInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutCriadorInput | ReservaUpsertWithWhereUniqueWithoutCriadorInput[]
    createMany?: ReservaCreateManyCriadorInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutCriadorInput | ReservaUpdateWithWhereUniqueWithoutCriadorInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutCriadorInput | ReservaUpdateManyWithWhereWithoutCriadorInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutSalasCriadasInput = {
    create?: XOR<UsuarioCreateWithoutSalasCriadasInput, UsuarioUncheckedCreateWithoutSalasCriadasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutSalasCriadasInput
    connect?: UsuarioWhereUniqueInput
  }

  export type EspacoCreateNestedManyWithoutSalaInput = {
    create?: XOR<EspacoCreateWithoutSalaInput, EspacoUncheckedCreateWithoutSalaInput> | EspacoCreateWithoutSalaInput[] | EspacoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutSalaInput | EspacoCreateOrConnectWithoutSalaInput[]
    createMany?: EspacoCreateManySalaInputEnvelope
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
  }

  export type EspacoUncheckedCreateNestedManyWithoutSalaInput = {
    create?: XOR<EspacoCreateWithoutSalaInput, EspacoUncheckedCreateWithoutSalaInput> | EspacoCreateWithoutSalaInput[] | EspacoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutSalaInput | EspacoCreateOrConnectWithoutSalaInput[]
    createMany?: EspacoCreateManySalaInputEnvelope
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
  }

  export type UsuarioUpdateOneRequiredWithoutSalasCriadasNestedInput = {
    create?: XOR<UsuarioCreateWithoutSalasCriadasInput, UsuarioUncheckedCreateWithoutSalasCriadasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutSalasCriadasInput
    upsert?: UsuarioUpsertWithoutSalasCriadasInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutSalasCriadasInput, UsuarioUpdateWithoutSalasCriadasInput>, UsuarioUncheckedUpdateWithoutSalasCriadasInput>
  }

  export type EspacoUpdateManyWithoutSalaNestedInput = {
    create?: XOR<EspacoCreateWithoutSalaInput, EspacoUncheckedCreateWithoutSalaInput> | EspacoCreateWithoutSalaInput[] | EspacoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutSalaInput | EspacoCreateOrConnectWithoutSalaInput[]
    upsert?: EspacoUpsertWithWhereUniqueWithoutSalaInput | EspacoUpsertWithWhereUniqueWithoutSalaInput[]
    createMany?: EspacoCreateManySalaInputEnvelope
    set?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    disconnect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    delete?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    update?: EspacoUpdateWithWhereUniqueWithoutSalaInput | EspacoUpdateWithWhereUniqueWithoutSalaInput[]
    updateMany?: EspacoUpdateManyWithWhereWithoutSalaInput | EspacoUpdateManyWithWhereWithoutSalaInput[]
    deleteMany?: EspacoScalarWhereInput | EspacoScalarWhereInput[]
  }

  export type EspacoUncheckedUpdateManyWithoutSalaNestedInput = {
    create?: XOR<EspacoCreateWithoutSalaInput, EspacoUncheckedCreateWithoutSalaInput> | EspacoCreateWithoutSalaInput[] | EspacoUncheckedCreateWithoutSalaInput[]
    connectOrCreate?: EspacoCreateOrConnectWithoutSalaInput | EspacoCreateOrConnectWithoutSalaInput[]
    upsert?: EspacoUpsertWithWhereUniqueWithoutSalaInput | EspacoUpsertWithWhereUniqueWithoutSalaInput[]
    createMany?: EspacoCreateManySalaInputEnvelope
    set?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    disconnect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    delete?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    connect?: EspacoWhereUniqueInput | EspacoWhereUniqueInput[]
    update?: EspacoUpdateWithWhereUniqueWithoutSalaInput | EspacoUpdateWithWhereUniqueWithoutSalaInput[]
    updateMany?: EspacoUpdateManyWithWhereWithoutSalaInput | EspacoUpdateManyWithWhereWithoutSalaInput[]
    deleteMany?: EspacoScalarWhereInput | EspacoScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutEspacosCriadosInput = {
    create?: XOR<UsuarioCreateWithoutEspacosCriadosInput, UsuarioUncheckedCreateWithoutEspacosCriadosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutEspacosCriadosInput
    connect?: UsuarioWhereUniqueInput
  }

  export type SalaCreateNestedOneWithoutEspacosInput = {
    create?: XOR<SalaCreateWithoutEspacosInput, SalaUncheckedCreateWithoutEspacosInput>
    connectOrCreate?: SalaCreateOrConnectWithoutEspacosInput
    connect?: SalaWhereUniqueInput
  }

  export type ReservaCreateNestedManyWithoutEspacoInput = {
    create?: XOR<ReservaCreateWithoutEspacoInput, ReservaUncheckedCreateWithoutEspacoInput> | ReservaCreateWithoutEspacoInput[] | ReservaUncheckedCreateWithoutEspacoInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutEspacoInput | ReservaCreateOrConnectWithoutEspacoInput[]
    createMany?: ReservaCreateManyEspacoInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type ReservaUncheckedCreateNestedManyWithoutEspacoInput = {
    create?: XOR<ReservaCreateWithoutEspacoInput, ReservaUncheckedCreateWithoutEspacoInput> | ReservaCreateWithoutEspacoInput[] | ReservaUncheckedCreateWithoutEspacoInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutEspacoInput | ReservaCreateOrConnectWithoutEspacoInput[]
    createMany?: ReservaCreateManyEspacoInputEnvelope
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
  }

  export type UsuarioUpdateOneRequiredWithoutEspacosCriadosNestedInput = {
    create?: XOR<UsuarioCreateWithoutEspacosCriadosInput, UsuarioUncheckedCreateWithoutEspacosCriadosInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutEspacosCriadosInput
    upsert?: UsuarioUpsertWithoutEspacosCriadosInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutEspacosCriadosInput, UsuarioUpdateWithoutEspacosCriadosInput>, UsuarioUncheckedUpdateWithoutEspacosCriadosInput>
  }

  export type SalaUpdateOneRequiredWithoutEspacosNestedInput = {
    create?: XOR<SalaCreateWithoutEspacosInput, SalaUncheckedCreateWithoutEspacosInput>
    connectOrCreate?: SalaCreateOrConnectWithoutEspacosInput
    upsert?: SalaUpsertWithoutEspacosInput
    connect?: SalaWhereUniqueInput
    update?: XOR<XOR<SalaUpdateToOneWithWhereWithoutEspacosInput, SalaUpdateWithoutEspacosInput>, SalaUncheckedUpdateWithoutEspacosInput>
  }

  export type ReservaUpdateManyWithoutEspacoNestedInput = {
    create?: XOR<ReservaCreateWithoutEspacoInput, ReservaUncheckedCreateWithoutEspacoInput> | ReservaCreateWithoutEspacoInput[] | ReservaUncheckedCreateWithoutEspacoInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutEspacoInput | ReservaCreateOrConnectWithoutEspacoInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutEspacoInput | ReservaUpsertWithWhereUniqueWithoutEspacoInput[]
    createMany?: ReservaCreateManyEspacoInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutEspacoInput | ReservaUpdateWithWhereUniqueWithoutEspacoInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutEspacoInput | ReservaUpdateManyWithWhereWithoutEspacoInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type ReservaUncheckedUpdateManyWithoutEspacoNestedInput = {
    create?: XOR<ReservaCreateWithoutEspacoInput, ReservaUncheckedCreateWithoutEspacoInput> | ReservaCreateWithoutEspacoInput[] | ReservaUncheckedCreateWithoutEspacoInput[]
    connectOrCreate?: ReservaCreateOrConnectWithoutEspacoInput | ReservaCreateOrConnectWithoutEspacoInput[]
    upsert?: ReservaUpsertWithWhereUniqueWithoutEspacoInput | ReservaUpsertWithWhereUniqueWithoutEspacoInput[]
    createMany?: ReservaCreateManyEspacoInputEnvelope
    set?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    disconnect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    delete?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    connect?: ReservaWhereUniqueInput | ReservaWhereUniqueInput[]
    update?: ReservaUpdateWithWhereUniqueWithoutEspacoInput | ReservaUpdateWithWhereUniqueWithoutEspacoInput[]
    updateMany?: ReservaUpdateManyWithWhereWithoutEspacoInput | ReservaUpdateManyWithWhereWithoutEspacoInput[]
    deleteMany?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutReservasCriadasInput = {
    create?: XOR<UsuarioCreateWithoutReservasCriadasInput, UsuarioUncheckedCreateWithoutReservasCriadasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutReservasCriadasInput
    connect?: UsuarioWhereUniqueInput
  }

  export type EspacoCreateNestedOneWithoutReservasInput = {
    create?: XOR<EspacoCreateWithoutReservasInput, EspacoUncheckedCreateWithoutReservasInput>
    connectOrCreate?: EspacoCreateOrConnectWithoutReservasInput
    connect?: EspacoWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UsuarioUpdateOneRequiredWithoutReservasCriadasNestedInput = {
    create?: XOR<UsuarioCreateWithoutReservasCriadasInput, UsuarioUncheckedCreateWithoutReservasCriadasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutReservasCriadasInput
    upsert?: UsuarioUpsertWithoutReservasCriadasInput
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutReservasCriadasInput, UsuarioUpdateWithoutReservasCriadasInput>, UsuarioUncheckedUpdateWithoutReservasCriadasInput>
  }

  export type EspacoUpdateOneRequiredWithoutReservasNestedInput = {
    create?: XOR<EspacoCreateWithoutReservasInput, EspacoUncheckedCreateWithoutReservasInput>
    connectOrCreate?: EspacoCreateOrConnectWithoutReservasInput
    upsert?: EspacoUpsertWithoutReservasInput
    connect?: EspacoWhereUniqueInput
    update?: XOR<XOR<EspacoUpdateToOneWithWhereWithoutReservasInput, EspacoUpdateWithoutReservasInput>, EspacoUncheckedUpdateWithoutReservasInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SalaCreateWithoutCriadorInput = {
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
    espacos?: EspacoCreateNestedManyWithoutSalaInput
  }

  export type SalaUncheckedCreateWithoutCriadorInput = {
    idSala?: number
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
    espacos?: EspacoUncheckedCreateNestedManyWithoutSalaInput
  }

  export type SalaCreateOrConnectWithoutCriadorInput = {
    where: SalaWhereUniqueInput
    create: XOR<SalaCreateWithoutCriadorInput, SalaUncheckedCreateWithoutCriadorInput>
  }

  export type SalaCreateManyCriadorInputEnvelope = {
    data: SalaCreateManyCriadorInput | SalaCreateManyCriadorInput[]
    skipDuplicates?: boolean
  }

  export type EspacoCreateWithoutCriadorInput = {
    codigoEspaco: string
    sala: SalaCreateNestedOneWithoutEspacosInput
    reservas?: ReservaCreateNestedManyWithoutEspacoInput
  }

  export type EspacoUncheckedCreateWithoutCriadorInput = {
    idEspaco?: number
    codigoEspaco: string
    idSalaPertence: number
    reservas?: ReservaUncheckedCreateNestedManyWithoutEspacoInput
  }

  export type EspacoCreateOrConnectWithoutCriadorInput = {
    where: EspacoWhereUniqueInput
    create: XOR<EspacoCreateWithoutCriadorInput, EspacoUncheckedCreateWithoutCriadorInput>
  }

  export type EspacoCreateManyCriadorInputEnvelope = {
    data: EspacoCreateManyCriadorInput | EspacoCreateManyCriadorInput[]
    skipDuplicates?: boolean
  }

  export type ReservaCreateWithoutCriadorInput = {
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    espaco: EspacoCreateNestedOneWithoutReservasInput
  }

  export type ReservaUncheckedCreateWithoutCriadorInput = {
    idReserva?: number
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    idEspacoReservado: number
  }

  export type ReservaCreateOrConnectWithoutCriadorInput = {
    where: ReservaWhereUniqueInput
    create: XOR<ReservaCreateWithoutCriadorInput, ReservaUncheckedCreateWithoutCriadorInput>
  }

  export type ReservaCreateManyCriadorInputEnvelope = {
    data: ReservaCreateManyCriadorInput | ReservaCreateManyCriadorInput[]
    skipDuplicates?: boolean
  }

  export type SalaUpsertWithWhereUniqueWithoutCriadorInput = {
    where: SalaWhereUniqueInput
    update: XOR<SalaUpdateWithoutCriadorInput, SalaUncheckedUpdateWithoutCriadorInput>
    create: XOR<SalaCreateWithoutCriadorInput, SalaUncheckedCreateWithoutCriadorInput>
  }

  export type SalaUpdateWithWhereUniqueWithoutCriadorInput = {
    where: SalaWhereUniqueInput
    data: XOR<SalaUpdateWithoutCriadorInput, SalaUncheckedUpdateWithoutCriadorInput>
  }

  export type SalaUpdateManyWithWhereWithoutCriadorInput = {
    where: SalaScalarWhereInput
    data: XOR<SalaUpdateManyMutationInput, SalaUncheckedUpdateManyWithoutCriadorInput>
  }

  export type SalaScalarWhereInput = {
    AND?: SalaScalarWhereInput | SalaScalarWhereInput[]
    OR?: SalaScalarWhereInput[]
    NOT?: SalaScalarWhereInput | SalaScalarWhereInput[]
    idSala?: IntFilter<"Sala"> | number
    nomeSala?: StringFilter<"Sala"> | string
    mapa?: StringFilter<"Sala"> | string
    limiteHorasReserva?: IntFilter<"Sala"> | number
    ativa?: BoolFilter<"Sala"> | boolean
    idUsuarioCriador?: IntFilter<"Sala"> | number
  }

  export type EspacoUpsertWithWhereUniqueWithoutCriadorInput = {
    where: EspacoWhereUniqueInput
    update: XOR<EspacoUpdateWithoutCriadorInput, EspacoUncheckedUpdateWithoutCriadorInput>
    create: XOR<EspacoCreateWithoutCriadorInput, EspacoUncheckedCreateWithoutCriadorInput>
  }

  export type EspacoUpdateWithWhereUniqueWithoutCriadorInput = {
    where: EspacoWhereUniqueInput
    data: XOR<EspacoUpdateWithoutCriadorInput, EspacoUncheckedUpdateWithoutCriadorInput>
  }

  export type EspacoUpdateManyWithWhereWithoutCriadorInput = {
    where: EspacoScalarWhereInput
    data: XOR<EspacoUpdateManyMutationInput, EspacoUncheckedUpdateManyWithoutCriadorInput>
  }

  export type EspacoScalarWhereInput = {
    AND?: EspacoScalarWhereInput | EspacoScalarWhereInput[]
    OR?: EspacoScalarWhereInput[]
    NOT?: EspacoScalarWhereInput | EspacoScalarWhereInput[]
    idEspaco?: IntFilter<"Espaco"> | number
    codigoEspaco?: StringFilter<"Espaco"> | string
    idUsuarioCriador?: IntFilter<"Espaco"> | number
    idSalaPertence?: IntFilter<"Espaco"> | number
  }

  export type ReservaUpsertWithWhereUniqueWithoutCriadorInput = {
    where: ReservaWhereUniqueInput
    update: XOR<ReservaUpdateWithoutCriadorInput, ReservaUncheckedUpdateWithoutCriadorInput>
    create: XOR<ReservaCreateWithoutCriadorInput, ReservaUncheckedCreateWithoutCriadorInput>
  }

  export type ReservaUpdateWithWhereUniqueWithoutCriadorInput = {
    where: ReservaWhereUniqueInput
    data: XOR<ReservaUpdateWithoutCriadorInput, ReservaUncheckedUpdateWithoutCriadorInput>
  }

  export type ReservaUpdateManyWithWhereWithoutCriadorInput = {
    where: ReservaScalarWhereInput
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyWithoutCriadorInput>
  }

  export type ReservaScalarWhereInput = {
    AND?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
    OR?: ReservaScalarWhereInput[]
    NOT?: ReservaScalarWhereInput | ReservaScalarWhereInput[]
    idReserva?: IntFilter<"Reserva"> | number
    motivo?: StringFilter<"Reserva"> | string
    horaInicio?: DateTimeFilter<"Reserva"> | Date | string
    horaFim?: DateTimeFilter<"Reserva"> | Date | string
    situacao?: StringFilter<"Reserva"> | string
    idUsuarioCriador?: IntFilter<"Reserva"> | number
    idEspacoReservado?: IntFilter<"Reserva"> | number
  }

  export type UsuarioCreateWithoutSalasCriadasInput = {
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    espacosCriados?: EspacoCreateNestedManyWithoutCriadorInput
    reservasCriadas?: ReservaCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioUncheckedCreateWithoutSalasCriadasInput = {
    idUsuario?: number
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    espacosCriados?: EspacoUncheckedCreateNestedManyWithoutCriadorInput
    reservasCriadas?: ReservaUncheckedCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioCreateOrConnectWithoutSalasCriadasInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutSalasCriadasInput, UsuarioUncheckedCreateWithoutSalasCriadasInput>
  }

  export type EspacoCreateWithoutSalaInput = {
    codigoEspaco: string
    criador: UsuarioCreateNestedOneWithoutEspacosCriadosInput
    reservas?: ReservaCreateNestedManyWithoutEspacoInput
  }

  export type EspacoUncheckedCreateWithoutSalaInput = {
    idEspaco?: number
    codigoEspaco: string
    idUsuarioCriador: number
    reservas?: ReservaUncheckedCreateNestedManyWithoutEspacoInput
  }

  export type EspacoCreateOrConnectWithoutSalaInput = {
    where: EspacoWhereUniqueInput
    create: XOR<EspacoCreateWithoutSalaInput, EspacoUncheckedCreateWithoutSalaInput>
  }

  export type EspacoCreateManySalaInputEnvelope = {
    data: EspacoCreateManySalaInput | EspacoCreateManySalaInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithoutSalasCriadasInput = {
    update: XOR<UsuarioUpdateWithoutSalasCriadasInput, UsuarioUncheckedUpdateWithoutSalasCriadasInput>
    create: XOR<UsuarioCreateWithoutSalasCriadasInput, UsuarioUncheckedCreateWithoutSalasCriadasInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutSalasCriadasInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutSalasCriadasInput, UsuarioUncheckedUpdateWithoutSalasCriadasInput>
  }

  export type UsuarioUpdateWithoutSalasCriadasInput = {
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    espacosCriados?: EspacoUpdateManyWithoutCriadorNestedInput
    reservasCriadas?: ReservaUpdateManyWithoutCriadorNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutSalasCriadasInput = {
    idUsuario?: IntFieldUpdateOperationsInput | number
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    espacosCriados?: EspacoUncheckedUpdateManyWithoutCriadorNestedInput
    reservasCriadas?: ReservaUncheckedUpdateManyWithoutCriadorNestedInput
  }

  export type EspacoUpsertWithWhereUniqueWithoutSalaInput = {
    where: EspacoWhereUniqueInput
    update: XOR<EspacoUpdateWithoutSalaInput, EspacoUncheckedUpdateWithoutSalaInput>
    create: XOR<EspacoCreateWithoutSalaInput, EspacoUncheckedCreateWithoutSalaInput>
  }

  export type EspacoUpdateWithWhereUniqueWithoutSalaInput = {
    where: EspacoWhereUniqueInput
    data: XOR<EspacoUpdateWithoutSalaInput, EspacoUncheckedUpdateWithoutSalaInput>
  }

  export type EspacoUpdateManyWithWhereWithoutSalaInput = {
    where: EspacoScalarWhereInput
    data: XOR<EspacoUpdateManyMutationInput, EspacoUncheckedUpdateManyWithoutSalaInput>
  }

  export type UsuarioCreateWithoutEspacosCriadosInput = {
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    salasCriadas?: SalaCreateNestedManyWithoutCriadorInput
    reservasCriadas?: ReservaCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioUncheckedCreateWithoutEspacosCriadosInput = {
    idUsuario?: number
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    salasCriadas?: SalaUncheckedCreateNestedManyWithoutCriadorInput
    reservasCriadas?: ReservaUncheckedCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioCreateOrConnectWithoutEspacosCriadosInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutEspacosCriadosInput, UsuarioUncheckedCreateWithoutEspacosCriadosInput>
  }

  export type SalaCreateWithoutEspacosInput = {
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
    criador: UsuarioCreateNestedOneWithoutSalasCriadasInput
  }

  export type SalaUncheckedCreateWithoutEspacosInput = {
    idSala?: number
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
    idUsuarioCriador: number
  }

  export type SalaCreateOrConnectWithoutEspacosInput = {
    where: SalaWhereUniqueInput
    create: XOR<SalaCreateWithoutEspacosInput, SalaUncheckedCreateWithoutEspacosInput>
  }

  export type ReservaCreateWithoutEspacoInput = {
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    criador: UsuarioCreateNestedOneWithoutReservasCriadasInput
  }

  export type ReservaUncheckedCreateWithoutEspacoInput = {
    idReserva?: number
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    idUsuarioCriador: number
  }

  export type ReservaCreateOrConnectWithoutEspacoInput = {
    where: ReservaWhereUniqueInput
    create: XOR<ReservaCreateWithoutEspacoInput, ReservaUncheckedCreateWithoutEspacoInput>
  }

  export type ReservaCreateManyEspacoInputEnvelope = {
    data: ReservaCreateManyEspacoInput | ReservaCreateManyEspacoInput[]
    skipDuplicates?: boolean
  }

  export type UsuarioUpsertWithoutEspacosCriadosInput = {
    update: XOR<UsuarioUpdateWithoutEspacosCriadosInput, UsuarioUncheckedUpdateWithoutEspacosCriadosInput>
    create: XOR<UsuarioCreateWithoutEspacosCriadosInput, UsuarioUncheckedCreateWithoutEspacosCriadosInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutEspacosCriadosInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutEspacosCriadosInput, UsuarioUncheckedUpdateWithoutEspacosCriadosInput>
  }

  export type UsuarioUpdateWithoutEspacosCriadosInput = {
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    salasCriadas?: SalaUpdateManyWithoutCriadorNestedInput
    reservasCriadas?: ReservaUpdateManyWithoutCriadorNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutEspacosCriadosInput = {
    idUsuario?: IntFieldUpdateOperationsInput | number
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    salasCriadas?: SalaUncheckedUpdateManyWithoutCriadorNestedInput
    reservasCriadas?: ReservaUncheckedUpdateManyWithoutCriadorNestedInput
  }

  export type SalaUpsertWithoutEspacosInput = {
    update: XOR<SalaUpdateWithoutEspacosInput, SalaUncheckedUpdateWithoutEspacosInput>
    create: XOR<SalaCreateWithoutEspacosInput, SalaUncheckedCreateWithoutEspacosInput>
    where?: SalaWhereInput
  }

  export type SalaUpdateToOneWithWhereWithoutEspacosInput = {
    where?: SalaWhereInput
    data: XOR<SalaUpdateWithoutEspacosInput, SalaUncheckedUpdateWithoutEspacosInput>
  }

  export type SalaUpdateWithoutEspacosInput = {
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    criador?: UsuarioUpdateOneRequiredWithoutSalasCriadasNestedInput
  }

  export type SalaUncheckedUpdateWithoutEspacosInput = {
    idSala?: IntFieldUpdateOperationsInput | number
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
  }

  export type ReservaUpsertWithWhereUniqueWithoutEspacoInput = {
    where: ReservaWhereUniqueInput
    update: XOR<ReservaUpdateWithoutEspacoInput, ReservaUncheckedUpdateWithoutEspacoInput>
    create: XOR<ReservaCreateWithoutEspacoInput, ReservaUncheckedCreateWithoutEspacoInput>
  }

  export type ReservaUpdateWithWhereUniqueWithoutEspacoInput = {
    where: ReservaWhereUniqueInput
    data: XOR<ReservaUpdateWithoutEspacoInput, ReservaUncheckedUpdateWithoutEspacoInput>
  }

  export type ReservaUpdateManyWithWhereWithoutEspacoInput = {
    where: ReservaScalarWhereInput
    data: XOR<ReservaUpdateManyMutationInput, ReservaUncheckedUpdateManyWithoutEspacoInput>
  }

  export type UsuarioCreateWithoutReservasCriadasInput = {
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    salasCriadas?: SalaCreateNestedManyWithoutCriadorInput
    espacosCriados?: EspacoCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioUncheckedCreateWithoutReservasCriadasInput = {
    idUsuario?: number
    foto?: string | null
    email: string
    nome: string
    admin?: boolean
    salasCriadas?: SalaUncheckedCreateNestedManyWithoutCriadorInput
    espacosCriados?: EspacoUncheckedCreateNestedManyWithoutCriadorInput
  }

  export type UsuarioCreateOrConnectWithoutReservasCriadasInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutReservasCriadasInput, UsuarioUncheckedCreateWithoutReservasCriadasInput>
  }

  export type EspacoCreateWithoutReservasInput = {
    codigoEspaco: string
    criador: UsuarioCreateNestedOneWithoutEspacosCriadosInput
    sala: SalaCreateNestedOneWithoutEspacosInput
  }

  export type EspacoUncheckedCreateWithoutReservasInput = {
    idEspaco?: number
    codigoEspaco: string
    idUsuarioCriador: number
    idSalaPertence: number
  }

  export type EspacoCreateOrConnectWithoutReservasInput = {
    where: EspacoWhereUniqueInput
    create: XOR<EspacoCreateWithoutReservasInput, EspacoUncheckedCreateWithoutReservasInput>
  }

  export type UsuarioUpsertWithoutReservasCriadasInput = {
    update: XOR<UsuarioUpdateWithoutReservasCriadasInput, UsuarioUncheckedUpdateWithoutReservasCriadasInput>
    create: XOR<UsuarioCreateWithoutReservasCriadasInput, UsuarioUncheckedCreateWithoutReservasCriadasInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutReservasCriadasInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutReservasCriadasInput, UsuarioUncheckedUpdateWithoutReservasCriadasInput>
  }

  export type UsuarioUpdateWithoutReservasCriadasInput = {
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    salasCriadas?: SalaUpdateManyWithoutCriadorNestedInput
    espacosCriados?: EspacoUpdateManyWithoutCriadorNestedInput
  }

  export type UsuarioUncheckedUpdateWithoutReservasCriadasInput = {
    idUsuario?: IntFieldUpdateOperationsInput | number
    foto?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    admin?: BoolFieldUpdateOperationsInput | boolean
    salasCriadas?: SalaUncheckedUpdateManyWithoutCriadorNestedInput
    espacosCriados?: EspacoUncheckedUpdateManyWithoutCriadorNestedInput
  }

  export type EspacoUpsertWithoutReservasInput = {
    update: XOR<EspacoUpdateWithoutReservasInput, EspacoUncheckedUpdateWithoutReservasInput>
    create: XOR<EspacoCreateWithoutReservasInput, EspacoUncheckedCreateWithoutReservasInput>
    where?: EspacoWhereInput
  }

  export type EspacoUpdateToOneWithWhereWithoutReservasInput = {
    where?: EspacoWhereInput
    data: XOR<EspacoUpdateWithoutReservasInput, EspacoUncheckedUpdateWithoutReservasInput>
  }

  export type EspacoUpdateWithoutReservasInput = {
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    criador?: UsuarioUpdateOneRequiredWithoutEspacosCriadosNestedInput
    sala?: SalaUpdateOneRequiredWithoutEspacosNestedInput
  }

  export type EspacoUncheckedUpdateWithoutReservasInput = {
    idEspaco?: IntFieldUpdateOperationsInput | number
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
    idSalaPertence?: IntFieldUpdateOperationsInput | number
  }

  export type SalaCreateManyCriadorInput = {
    idSala?: number
    nomeSala: string
    mapa: string
    limiteHorasReserva: number
    ativa?: boolean
  }

  export type EspacoCreateManyCriadorInput = {
    idEspaco?: number
    codigoEspaco: string
    idSalaPertence: number
  }

  export type ReservaCreateManyCriadorInput = {
    idReserva?: number
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    idEspacoReservado: number
  }

  export type SalaUpdateWithoutCriadorInput = {
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    espacos?: EspacoUpdateManyWithoutSalaNestedInput
  }

  export type SalaUncheckedUpdateWithoutCriadorInput = {
    idSala?: IntFieldUpdateOperationsInput | number
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    espacos?: EspacoUncheckedUpdateManyWithoutSalaNestedInput
  }

  export type SalaUncheckedUpdateManyWithoutCriadorInput = {
    idSala?: IntFieldUpdateOperationsInput | number
    nomeSala?: StringFieldUpdateOperationsInput | string
    mapa?: StringFieldUpdateOperationsInput | string
    limiteHorasReserva?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EspacoUpdateWithoutCriadorInput = {
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    sala?: SalaUpdateOneRequiredWithoutEspacosNestedInput
    reservas?: ReservaUpdateManyWithoutEspacoNestedInput
  }

  export type EspacoUncheckedUpdateWithoutCriadorInput = {
    idEspaco?: IntFieldUpdateOperationsInput | number
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    idSalaPertence?: IntFieldUpdateOperationsInput | number
    reservas?: ReservaUncheckedUpdateManyWithoutEspacoNestedInput
  }

  export type EspacoUncheckedUpdateManyWithoutCriadorInput = {
    idEspaco?: IntFieldUpdateOperationsInput | number
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    idSalaPertence?: IntFieldUpdateOperationsInput | number
  }

  export type ReservaUpdateWithoutCriadorInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    espaco?: EspacoUpdateOneRequiredWithoutReservasNestedInput
  }

  export type ReservaUncheckedUpdateWithoutCriadorInput = {
    idReserva?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    idEspacoReservado?: IntFieldUpdateOperationsInput | number
  }

  export type ReservaUncheckedUpdateManyWithoutCriadorInput = {
    idReserva?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    idEspacoReservado?: IntFieldUpdateOperationsInput | number
  }

  export type EspacoCreateManySalaInput = {
    idEspaco?: number
    codigoEspaco: string
    idUsuarioCriador: number
  }

  export type EspacoUpdateWithoutSalaInput = {
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    criador?: UsuarioUpdateOneRequiredWithoutEspacosCriadosNestedInput
    reservas?: ReservaUpdateManyWithoutEspacoNestedInput
  }

  export type EspacoUncheckedUpdateWithoutSalaInput = {
    idEspaco?: IntFieldUpdateOperationsInput | number
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
    reservas?: ReservaUncheckedUpdateManyWithoutEspacoNestedInput
  }

  export type EspacoUncheckedUpdateManyWithoutSalaInput = {
    idEspaco?: IntFieldUpdateOperationsInput | number
    codigoEspaco?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
  }

  export type ReservaCreateManyEspacoInput = {
    idReserva?: number
    motivo: string
    horaInicio: Date | string
    horaFim: Date | string
    situacao: string
    idUsuarioCriador: number
  }

  export type ReservaUpdateWithoutEspacoInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    criador?: UsuarioUpdateOneRequiredWithoutReservasCriadasNestedInput
  }

  export type ReservaUncheckedUpdateWithoutEspacoInput = {
    idReserva?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
  }

  export type ReservaUncheckedUpdateManyWithoutEspacoInput = {
    idReserva?: IntFieldUpdateOperationsInput | number
    motivo?: StringFieldUpdateOperationsInput | string
    horaInicio?: DateTimeFieldUpdateOperationsInput | Date | string
    horaFim?: DateTimeFieldUpdateOperationsInput | Date | string
    situacao?: StringFieldUpdateOperationsInput | string
    idUsuarioCriador?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}