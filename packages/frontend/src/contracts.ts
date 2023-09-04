import * as SubnetRegistratorJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/SubnetRegistrator.sol/SubnetRegistrator.json'
import * as ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json'
import {
  SubnetRegistrator,
  ToposCore,
} from '@topos-protocol/topos-smart-contracts/typechain-types/contracts/topos-core'
import { ethers } from 'ethers'

export const subnetRegistratorContract = new ethers.Contract(
  import.meta.env.VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS || '',
  SubnetRegistratorJSON.abi
) as SubnetRegistrator

export const toposCoreContract = new ethers.Contract(
  import.meta.env.VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS || '',
  ToposCoreJSON.abi
) as ToposCore
