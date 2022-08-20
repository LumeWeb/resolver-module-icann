import {
  DNSResult,
  ResolverOptions,
  AbstractResolverModule,
} from "@lumeweb/libresolver";
export default class Icann extends AbstractResolverModule {
  resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult>;
}
