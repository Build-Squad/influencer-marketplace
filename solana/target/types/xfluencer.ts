export type Xfluencer = {
  "version": "0.1.0",
  "name": "xfluencer",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "business",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "influencer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "judge",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "businessDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "influencerReceiveTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultAccountBump",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "business",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "businessDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createEscrow",
      "accounts": [
        {
          "name": "validationAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimEscrow",
      "accounts": [
        {
          "name": "influencer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelEscrowSol",
      "accounts": [
        {
          "name": "business",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "validateEscrowSol",
      "accounts": [
        {
          "name": "validationAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "influencer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetState",
          "type": "u8"
        },
        {
          "name": "percentageFee",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "businessKey",
            "type": "publicKey"
          },
          {
            "name": "businessDepositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "influencerKey",
            "type": "publicKey"
          },
          {
            "name": "influencerReceiveTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "judgeKey",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "orderCode",
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "status\n        0: New\n        1: Shipping\n        2: Delivered"
            ],
            "type": "u8"
          },
          {
            "name": "deliveryTime",
            "type": "i64"
          },
          {
            "name": "trialDay",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "escrowAccountSolana",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validationAuthority",
            "type": "publicKey"
          },
          {
            "name": "from",
            "type": "publicKey"
          },
          {
            "name": "to",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "orderCode",
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "status\n        0: New\n        1: Cancel\n        2: Delivered"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "EscrowAccountSolanaCreated",
      "fields": [
        {
          "name": "business",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "influencer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "orderCode",
          "type": "string",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CannotClaim",
      "msg": "Cannot claim"
    },
    {
      "code": 6001,
      "name": "AlreadyClaim",
      "msg": "Already claim"
    },
    {
      "code": 6002,
      "name": "EscrowAlreadyCancel",
      "msg": "Escrow already cancel for business"
    },
    {
      "code": 6003,
      "name": "EscrowAlreadyReleased",
      "msg": "Escrow already released for influencer"
    },
    {
      "code": 6004,
      "name": "BadTargetStateForEscrow",
      "msg": "Bad Target State for Escrow (1) for cancel, (2) for release"
    },
    {
      "code": 6005,
      "name": "MissmatchBusiness",
      "msg": "Missmatch business public key"
    },
    {
      "code": 6006,
      "name": "MissmatchInfluencer",
      "msg": "Missmatch influencer publick key"
    },
    {
      "code": 6007,
      "name": "BadEscrowState",
      "msg": "Bad Escrow State"
    },
    {
      "code": 6008,
      "name": "MissmatchAuthority",
      "msg": "Missmatch Authority"
    },
    {
      "code": 6009,
      "name": "PercentageFeeOutOfrange",
      "msg": "Percengate Fee Out of Range"
    },
    {
      "code": 6010,
      "name": "NumericalProblemFoundCalculatingFees",
      "msg": "Numerical Problem Found Calculating Fees"
    },
    {
      "code": 6011,
      "name": "BusinessHasInsufficientAmountOfTokens",
      "msg": "Busines Has Insufficient Amount Of Tokens"
    }
  ]
};

export const IDL: Xfluencer = {
  "version": "0.1.0",
  "name": "xfluencer",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "business",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "influencer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "judge",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "businessDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "influencerReceiveTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultAccountBump",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "business",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "businessDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createEscrow",
      "accounts": [
        {
          "name": "validationAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimEscrow",
      "accounts": [
        {
          "name": "influencer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "orderCode",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelEscrowSol",
      "accounts": [
        {
          "name": "business",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "validateEscrowSol",
      "accounts": [
        {
          "name": "validationAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "influencer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "business",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "targetState",
          "type": "u8"
        },
        {
          "name": "percentageFee",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "businessKey",
            "type": "publicKey"
          },
          {
            "name": "businessDepositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "influencerKey",
            "type": "publicKey"
          },
          {
            "name": "influencerReceiveTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "judgeKey",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "orderCode",
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "status\n        0: New\n        1: Shipping\n        2: Delivered"
            ],
            "type": "u8"
          },
          {
            "name": "deliveryTime",
            "type": "i64"
          },
          {
            "name": "trialDay",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "escrowAccountSolana",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validationAuthority",
            "type": "publicKey"
          },
          {
            "name": "from",
            "type": "publicKey"
          },
          {
            "name": "to",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "orderCode",
            "type": "u64"
          },
          {
            "name": "status",
            "docs": [
              "status\n        0: New\n        1: Cancel\n        2: Delivered"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "EscrowAccountSolanaCreated",
      "fields": [
        {
          "name": "business",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "influencer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "orderCode",
          "type": "string",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CannotClaim",
      "msg": "Cannot claim"
    },
    {
      "code": 6001,
      "name": "AlreadyClaim",
      "msg": "Already claim"
    },
    {
      "code": 6002,
      "name": "EscrowAlreadyCancel",
      "msg": "Escrow already cancel for business"
    },
    {
      "code": 6003,
      "name": "EscrowAlreadyReleased",
      "msg": "Escrow already released for influencer"
    },
    {
      "code": 6004,
      "name": "BadTargetStateForEscrow",
      "msg": "Bad Target State for Escrow (1) for cancel, (2) for release"
    },
    {
      "code": 6005,
      "name": "MissmatchBusiness",
      "msg": "Missmatch business public key"
    },
    {
      "code": 6006,
      "name": "MissmatchInfluencer",
      "msg": "Missmatch influencer publick key"
    },
    {
      "code": 6007,
      "name": "BadEscrowState",
      "msg": "Bad Escrow State"
    },
    {
      "code": 6008,
      "name": "MissmatchAuthority",
      "msg": "Missmatch Authority"
    },
    {
      "code": 6009,
      "name": "PercentageFeeOutOfrange",
      "msg": "Percengate Fee Out of Range"
    },
    {
      "code": 6010,
      "name": "NumericalProblemFoundCalculatingFees",
      "msg": "Numerical Problem Found Calculating Fees"
    },
    {
      "code": 6011,
      "name": "BusinessHasInsufficientAmountOfTokens",
      "msg": "Busines Has Insufficient Amount Of Tokens"
    }
  ]
};
