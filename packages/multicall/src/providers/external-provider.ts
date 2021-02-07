import { ExternalProvider } from '@ethersproject/providers'
import { Multicall, MulticallOptions } from '../multicall'
import { JsonRpcRequest, JsonRpcResponseCallback } from "@0xsequence/network"

export class MulticallExternalProvider implements ExternalProvider {
  private multicall: Multicall

  constructor(private provider: ExternalProvider, multicall?: Multicall | Partial<MulticallOptions>) {
    this.multicall = Multicall.isMulticall(multicall) ? multicall : new Multicall(multicall)
  }

  next = async (req: JsonRpcRequest, callback: JsonRpcResponseCallback) => {
    this.provider.send ? this.provider.send(req, callback) : this.provider.sendAsync(req, callback)
  }

  sendAsync = (request: JsonRpcRequest, callback: JsonRpcResponseCallback) => {
    this.multicall.handle(this.next, request, callback)
  }

  send = (request: JsonRpcRequest, callback: JsonRpcResponseCallback) => {
    this.multicall.handle(this.next, request, callback)
  }
}
