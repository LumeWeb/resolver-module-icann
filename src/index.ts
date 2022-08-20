import {
  DNSResult,
  ResolverOptions,
  AbstractResolverModule,
  resolveSuccess,
  resolverEmptyResponse,
  isDomain,
  DNS_RECORD_TYPE,
  DNSRecord,
  isIp,
} from "@lumeweb/libresolver";

export default class Icann extends AbstractResolverModule {
  async resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult> {
    if (!(options.options && "subquery" in options.options)) {
      return resolverEmptyResponse();
    }

    if (!isDomain(domain)) {
      return resolverEmptyResponse();
    }

    const records: DNSRecord[] = [];

    if ([DNS_RECORD_TYPE.A, DNS_RECORD_TYPE.CNAME].includes(options.type)) {
      const data = {
        domain,
        nameserver: options?.options?.nameserver ?? undefined,
      };

      const query = this.resolver.rpcNetwork.query(
        "dnslookup",
        "icann",
        data,
        bypassCache
      );

      const ret = await query.result;

      if (ret && ret.length > 0) {
        let type =
          isDomain(ret) && !isIp(ret)
            ? DNS_RECORD_TYPE.CNAME
            : DNS_RECORD_TYPE.A;
        records.push({ type, value: ret });
      }
    }

    if (0 < records.length) {
      return resolveSuccess(records);
    }

    return resolverEmptyResponse();
  }
}
