// chain status
export const chainStatus = {
    WAITING: 'waiting',
    PENDING: 'pending',
    SUCCESS: 'success',
    FAIL: 'failed'
}

// Currently supported networks
export const ChainType = {
    ethereum: 'Ethereum',
    moon: 'Moonbeam',
    bsc: 'BSC',
}

// adot search results by category
export const adotAppName = {
    weweave: 'weweave',
    smartWeaveContract: 'SmartWeaveContract',
    mirror: 'MirrorXYZ',
    twitter: 'TwittAR',
    mscProject: 'Msc-Project'
}

export const paymentStatus = {
    UNPAID: 'unpaid',
    PAID: 'paid',
    EXPIRED: 'expired'
}

// token icon
export const tokenListHasLogo = [
    'wbtc',
    'vrt',
    'usdt',
    'usdc',
    'uni',
    'sos',
    'eth',
    'dai',
    'ar',
    'ardrive',
    'xyz',
    'glmr',
    'dodo',
    'mask',
    'bank',
    'zlk',
    'cfx',
    't4ever',
    'fox',
    'bnb',
    'lat',
    'xsgd',
    'tar',
    'tusdc',
    'tardrive',
    'arg',
    'fra'
]

// The length of hex address bytes (without checksum)
export const ADDRESS_BYTE_LENGTH = 30
// The alphabet for base26 algorithm for content info encoding
export const ADDRESS_ALPHABET = '83456729ABCDFGHJKNPQRSTWYZ'