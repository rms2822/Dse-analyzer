# Rare Earths — ElevenLabs v3 narration (tagged)

Companion to `script.md` (which stays the clean reading copy / source of
truth for word counts and chapter timing). This version adds Eleven v3
[Audio Tags](https://elevenlabs.io/blog/v3-audiotags) — bracketed
natural-language delivery cues the v3 model interprets directly in the text,
not an enum or SSML.

**Voice setup**: one narrator voice for everything except the four labeled
lines in THE TRAP, which use Eleven's **Text to Dialogue** multi-speaker
format (`Speaker: [tag] text`) — assign `Factory Manager` and
`Export Official` to two distinct voices in Studio/API for that exchange,
then switch back to the narrator voice.

**Settings**: v3 leans stability lower than v2 for tag responsiveness — start
around Stability ~35-45% / Style ~30-40% and re-render the first chapter once
to check the tags aren't being over-acted before running the full thing.
Don't stack more than one tag per sentence except at real emotional pivots
(the model reads adjacent tags as compounding, and it gets hammy fast).

---

## Opening

[serious] On June 22nd, 2026, China's Ministry of Commerce published a short list.

[flat] Ten American companies. No press conference. No warships. No missiles. Just ten names, and one word next to them: restricted.

[pause] Two of those companies mine and process the material inside American fighter jets, wind turbines, and electric motors. Within days, the one country that turns their raw material into something a factory can actually use simply stopped signing their paperwork.

[wry] China didn't invade anyone. It didn't need to. [drawn out] It just... stopped stamping a form.

[building intensity] Every phone in your pocket. Every wind turbine spinning over the North Sea. Every MRI machine, every electric motor, every precision-guided missile built in the last twenty years — all of it depends on seventeen elements almost nobody outside a chemistry classroom can name, and on one country's willingness to keep processing them.

[serious, slower] This is a story about the stamp. About how the world built its entire technological future on top of a paperwork chokepoint, and pretended it was a mining problem.

## THE RECIPE

[explaining] Rare earths aren't actually rare. They're scattered through the Earth's crust almost everywhere, in tiny concentrations, always mixed together, never alone. Seventeen elements, chemically almost identical, clumped at the bottom of the periodic table where most people's eyes glaze over.

[wry] Digging them up is the easy part. Separating one from the other is not. [amused] Think less "mining" and more "baking a soufflé at industrial scale, in acid, five hundred times in a row, without ruining a single batch." That's what it takes to turn a shovel of mixed ore into one pure element pure enough to build anything with.

[flat, factual] China mines about 60 percent of the world's rare earth ore. That's the part most people picture. [emphasis] It's not the part that matters. China refines close to 90 percent of it — the step that turns rock into raw material. And when that raw material becomes the strongest magnets on Earth, the kind small enough for a phone and strong enough for a fighter jet, 94 percent of that final step happens in China too. [pause] Twenty years ago it was half that. Nobody declared war to get there. They just kept building refineries while everyone else kept mining rocks and shipping them east.

[sincere, slower] An autoworker in Michigan building electric motors. A wind-turbine technician in Denmark. A radiologist in São Paulo waiting on a replacement part for an MRI machine. None of them have ever seen a rare earth refinery. [somber] All of them are one stamp away from a shutdown.

[serious] There is no meaningful alternative supply chain. Not because the rock is scarce. Because almost nobody else ever learned to finish it.

## THE GRUDGE THAT BECAME A STRATEGY

[reflective] In 1992, Deng Xiaoping toured southern China and said something that Beijing never stopped repeating internally: [quoting, wry] the Middle East has oil, China has rare earths.

[wry] At the time, it sounded almost like a joke. The United States, not China, dominated this industry. A single mine in the California desert called Mountain Pass supplied practically the entire non-communist world with rare earths for three straight decades, from the 1950s into the 1980s. [flat] America built the modern magnet industry and barely noticed it had a chokehold on it.

[building tension] Then China undercut the price. Not by a little — by enough that mining and refining rare earths in America stopped being profitable at all. Environmental rules that didn't apply the same way in China made the math even easier. Through the 1990s and into the 2000s, the industry didn't get stolen. It got outcompeted, quietly, one contract at a time, [pause] until Mountain Pass's own refining line shut down in 1998, a toxic spill closed the whole site in 2002, and nobody in Washington thought it was worth reopening.

[measured] Mountain Pass did reopen, in 2018. It's mining again. It produces roughly a tenth of the world's raw rare earth ore today. [wry] But for years afterward, a lot of that ore still got shipped to China to actually be refined — because the mine came back before the refinery did. [flat, final] Same hill. Same rock. A different flag flying over it changes nothing if the finishing plant is still eight thousand miles away.

## THE TRAP

[skeptical] So surely this fixes itself. America has its mine back. Allied countries are opening new ones. Australia, in particular, has real deposits. Give it a few years and the chokepoint disappears.

[pause] [pointed] So why hasn't it?

[explaining, serious] Because the mine was never the chokepoint. The refinery is. And building one from scratch isn't a supply chain decision, it's closer to building a small chemical weapons plant's worth of infrastructure: hundreds of precise separation stages, extreme heat and acid at every step, and — because most rare earth ore comes bundled with thorium and uranium — a radioactive waste stream that has to be handled by design, not as an afterthought.

[flat, factual] Today, real industrial-scale rare earth refining exists in exactly three places outside China: Malaysia, a small facility in the United States, and one plant in Estonia. That's the entire non-Chinese refining capacity on Earth. Building a new one, from permit to output, takes the better part of a decade. Nobody budgets for a chokepoint that hasn't closed yet.

[quieter, ominous] And the chokepoint doesn't need to physically close to work. It just needs a form to sit on a desk.

Factory Manager: [urgent] The shipment's ready. It's sitting at the port.
Export Official: [flat, bureaucratic] Is the export license signed?
Factory Manager: [tense, hesitant] Not yet.
Export Official: [matter-of-fact] Then it's not moving. Doesn't matter what's in the container.

[narrator voice resumes, serious] This is the trap, and it's the same one every resource chokepoint eventually teaches its owner: you don't need to block the material. You need to control one signature the material can't move without. [dry] A licensing office in Beijing can do more to an American factory floor than a naval blockade ever could, and it never has to fire a shot to do it.

## THE CLOCK

[brisk, factual] In April 2025, China added seven rare earth elements and the magnets made from them to its export control list, timed almost exactly to a new round of American tariffs. In October 2025, it went further, then suspended the new controls for one year as part of a trade truce — but kept the April restrictions and the licensing infrastructure fully in place. [pointed] Restraint, not retreat.

[pause] Then, on June 22nd, 2026, it added ten more American companies straight to the list, including two of the biggest rare earth names in the country.

[urgent, rising] Prices on some of these materials have already spiked sixfold. European manufacturers report export license approval rates below one in four. [slower, weighty] And that one-year suspension from October runs out on November 10th, 2026 — a few months from now. If it isn't renewed, five more rare earth elements snap back under full control, all at once, on companies and supply chains that haven't had time to prepare for the first round, let alone a second.

[measured] Nobody knows yet whether that deadline gets extended again. [serious] That's not an oversight in this story. That's the story. The leverage was never a one-time event. It's a switch China can flip, loosen, and flip again, watching exactly how much pressure the rest of the world can absorb before flipping it back.

[slowing down] The mines can reopen. They have. The ore is still down there, same as it always was. Digging it up was never the hard part, and it never will be. Learning to finish it — that's the part nobody else built in time. [pause] [flat, final] Until that changes, it doesn't matter whose flag is on the hill. The stamp still says Beijing.
