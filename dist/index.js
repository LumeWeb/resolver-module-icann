import { AbstractResolverModule, resolveSuccess, resolverEmptyResponse, isDomain, DNS_RECORD_TYPE, isIp, } from "@lumeweb/libresolver";
export default class Icann extends AbstractResolverModule {
    async resolve(domain, options, bypassCache) {
        if (!(options.options && "subquery" in options.options)) {
            return resolverEmptyResponse();
        }
        if (isIp(domain)) {
            return resolverEmptyResponse();
        }
        const records = [];
        if ([DNS_RECORD_TYPE.A, DNS_RECORD_TYPE.CNAME].includes(options.type)) {
            const data = {
                domain,
                nameserver: options?.options?.nameserver ?? undefined,
            };
            const query = this.resolver.rpcNetwork.wisdomQuery("resolve", "dns", data, bypassCache);
            const ret = await query.result;
            if (ret.error) {
                throw new Error(ret.error);
            }
            if (ret.data.length > 0) {
                let type = isDomain(ret.data) && !isIp(ret.data)
                    ? DNS_RECORD_TYPE.CNAME
                    : DNS_RECORD_TYPE.A;
                records.push({ type, value: ret.data });
            }
        }
        if (0 < records.length) {
            return resolveSuccess(records);
        }
        return resolverEmptyResponse();
    }
}
