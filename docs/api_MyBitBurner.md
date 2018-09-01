---
id: MyBitBurner
title: MyBitBurner
---

<div class="contract-doc"><div class="contract"><h2 class="contract-header"><span class="contract-kind">contract</span> MyBitBurner</h2><div class="source">Source: <a href="git+https://github.com/MyBitFoundation/dapp-payroll/blob/v1.0.0/contracts/MyBitBurner.sol" target="_blank">MyBitBurner.sol</a></div></div><div class="index"><h2>Index</h2><ul><li><a href="MyBitBurner.html#LogBurnerAuthorized">LogBurnerAuthorized</a></li><li><a href="MyBitBurner.html#LogMYBBurned">LogMYBBurned</a></li><li><a href="MyBitBurner.html#authorizeBurner">authorizeBurner</a></li><li><a href="MyBitBurner.html#burn">burn</a></li><li><a href="MyBitBurner.html#">fallback</a></li><li><a href="MyBitBurner.html#removeBurner">removeBurner</a></li></ul></div><div class="reference"><h2>Reference</h2><div class="events"><h3>Events</h3><ul><li><div class="item event"><span id="LogBurnerAuthorized" class="anchor-marker"></span><h4 class="name">LogBurnerAuthorized</h4><div class="body"><code class="signature">event <strong>LogBurnerAuthorized</strong><span>(address _owner, address _burningContract) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_owner</code> - address</div><div><code>_burningContract</code> - address</div></dd></dl></div></div></li><li><div class="item event"><span id="LogMYBBurned" class="anchor-marker"></span><h4 class="name">LogMYBBurned</h4><div class="body"><code class="signature">event <strong>LogMYBBurned</strong><span>(address _tokenHolder, address _burningContract, uint _amount) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_tokenHolder</code> - address</div><div><code>_burningContract</code> - address</div><div><code>_amount</code> - uint</div></dd></dl></div></div></li></ul></div><div class="functions"><h3>Functions</h3><ul><li><div class="item function"><span id="authorizeBurner" class="anchor-marker"></span><h4 class="name">authorizeBurner</h4><div class="body"><code class="signature">function <strong>authorizeBurner</strong><span>(address _burningContract) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_burningContract</code> - address</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="burn" class="anchor-marker"></span><h4 class="name">burn</h4><div class="body"><code class="signature">function <strong>burn</strong><span>(address _tokenHolder, uint _amount) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_tokenHolder</code> - address</div><div><code>_amount</code> - uint</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li><li><div class="item function"><span id="fallback" class="anchor-marker"></span><h4 class="name">fallback</h4><div class="body"><code class="signature">function <strong></strong><span>(address _myBitTokenAddress) </span><span>public </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_myBitTokenAddress</code> - address</div></dd></dl></div></div></li><li><div class="item function"><span id="removeBurner" class="anchor-marker"></span><h4 class="name">removeBurner</h4><div class="body"><code class="signature">function <strong>removeBurner</strong><span>(address _burningContract) </span><span>external </span><span>returns  (bool) </span></code><hr/><dl><dt><span class="label-parameters">Parameters:</span></dt><dd><div><code>_burningContract</code> - address</div></dd><dt><span class="label-return">Returns:</span></dt><dd>bool</dd></dl></div></div></li></ul></div></div></div>