REMIX_URL := "https://remix.ethereum.org/\#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.25+commit.b61c2a91.js"


.PHONY: remix
remix:
	remixd -s . $(REMIX_URL)