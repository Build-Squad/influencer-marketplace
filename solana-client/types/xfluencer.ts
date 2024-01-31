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
          "name": "buyer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seller",
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
          "name": "buyerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sellerReceiveTokenAccount",
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
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerDepositTokenAccount",
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
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyerKey",
            "type": "publicKey"
          },
          {
            "name": "buyerDepositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "sellerKey",
            "type": "publicKey"
          },
          {
            "name": "sellerReceiveTokenAccount",
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
          "name": "buyer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "seller",
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
          "name": "buyerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sellerReceiveTokenAccount",
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
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "buyerDepositTokenAccount",
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
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyerKey",
            "type": "publicKey"
          },
          {
            "name": "buyerDepositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "sellerKey",
            "type": "publicKey"
          },
          {
            "name": "sellerReceiveTokenAccount",
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
    }
  ]
};
