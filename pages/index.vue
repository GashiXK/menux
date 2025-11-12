<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-ink-900 dark:via-ink-950 dark:to-ink-900 text-ink-900 dark:text-ink-100">
    <header class="sticky top-0 z-40 border-b border-ink-100/60 dark:border-ink-800/60 bg-white/80 dark:bg-ink-950/70 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30">
            <UIcon name="i-heroicons-rocket-launch" class="h-6 w-6 text-white" />
          </span>
          <div>
            <p class="text-xl font-semibold text-ink-900 dark:text-white leading-tight">MenuPika</p>
            <p class="text-xs font-medium uppercase tracking-widest text-brand-600 dark:text-brand-300">Platformë digjitale menusë</p>
          </div>
        </NuxtLink>
        <nav class="hidden items-center gap-8 text-sm font-medium text-ink-600 dark:text-ink-300 lg:flex">
          <a href="#features" class="hover:text-brand-600 dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg px-1 py-1">Veçoritë</a>
          <a href="#templates" class="hover:text-brand-600 dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg px-1 py-1">Shabllonet</a>
          <a href="#analytics" class="hover:text-brand-600 dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg px-1 py-1">Analiza</a>
          <a href="#pricing" class="hover:text-brand-600 dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg px-1 py-1">Çmimet</a>
          <a href="#testimonials" class="hover:text-brand-600 dark:hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg px-1 py-1">Dëshmitë</a>
        </nav>
        <div class="flex items-center gap-3">
          <UButton to="/auth/login" variant="ghost" size="sm" label="Hyni" />
          <UButton to="/demo" size="sm" color="primary" label="Shikoni demonstrimin" icon="i-heroicons-eye" />
        </div>
      </div>
    </header>

    <main>
      <section id="hero" class="relative overflow-hidden">
        <div class="absolute inset-0 -z-10 bg-gradient-to-br from-brand-100 via-transparent to-secondary/40 dark:from-brand-900/20 dark:via-transparent dark:to-secondary/20" />
        <div class="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div class="space-y-8">
            <span class="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-900/30 px-4 py-1 text-sm font-medium text-brand-700 dark:text-brand-200 ring-1 ring-brand-500/20">
              <UIcon name="i-heroicons-sparkles" class="h-4 w-4" />
              Përmirësoni përvojën e darkuesve
            </span>
            <h1 class="text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl dark:text-white">
              Krijoni menu digjitale që e kthejnë çdo vizitor në klient besnik
            </h1>
            <p class="max-w-2xl text-lg text-ink-600 dark:text-ink-300">
              MenuPika bashkon sistemet moderne të dizajnit me publikimin në kohë reale, duke sjellë një përvojë të nivelit enterprise në celular, tablet dhe ekrane mbi tryezë.
            </p>
            <div class="flex flex-wrap gap-4">
              <UButton to="/auth/login" size="lg" color="primary" label="Filloni krijimin" icon="i-heroicons-arrow-right-circle" />
              <UButton to="#features" size="lg" variant="soft" label="Pse MenuPika?" icon="i-heroicons-information-circle" />
            </div>
            <div class="flex flex-wrap items-center gap-10 pt-10 text-sm text-ink-500 dark:text-ink-400">
              <div class="space-y-1">
                <p class="text-xl font-semibold text-ink-900 dark:text-white">2.5M+</p>
                <p>menu të hapura çdo muaj</p>
              </div>
              <div class="space-y-1">
                <p class="text-xl font-semibold text-ink-900 dark:text-white">45%</p>
                <p>rritje e shitjeve shtesë</p>
              </div>
              <div class="space-y-1">
                <p class="text-xl font-semibold text-ink-900 dark:text-white">120+</p>
                <p>shabllone ekskluzive</p>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/20 via-transparent to-secondary/30 blur-3xl" />
            <div class="relative overflow-hidden rounded-3xl border border-ink-100/80 bg-white/80 shadow-xl shadow-brand-500/10 dark:border-ink-800 dark:bg-ink-950/60 backdrop-blur">
              <div class="flex items-center justify-between border-b border-ink-100/60 px-6 py-4 dark:border-ink-800/80">
                <div class="flex items-center gap-3">
                  <span class="h-10 w-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <UIcon name="i-heroicons-qr-code" class="h-6 w-6 text-brand-600" />
                  </span>
                  <div>
                    <p class="text-sm font-semibold text-ink-700 dark:text-ink-200">Tavolina 08 · Skyline Lounge</p>
                    <p class="text-xs text-ink-500 dark:text-ink-400">Përditësime në kohë reale · 2 pajisje aktive</p>
                  </div>
                </div>
                <UButton to="/demo" size="xs" variant="outline" label="Shiko menunë" />
              </div>
              <div class="space-y-6 px-6 py-8">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold text-ink-900 dark:text-white">Pjatat firmë të mbrëmjes</h3>
                  <span class="rounded-full border border-brand-500/40 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">Përkthyer automatikisht</span>
                </div>
                <div class="grid gap-4">
                  <div class="flex items-start justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 shadow-sm hover:border-brand-200 hover:shadow-md transition dark:border-ink-800 dark:bg-ink-900/80">
                    <div>
                      <p class="font-semibold text-ink-900 dark:text-white">Truffle Arancini</p>
                      <p class="text-sm text-ink-500 dark:text-ink-400">Rizoto krokante, mocarela e tymosur, vaj borziloku</p>
                    </div>
                    <p class="text-sm font-semibold text-brand-600 dark:text-brand-300">€12</p>
                  </div>
                  <div class="flex items-start justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 shadow-sm hover:border-brand-200 hover:shadow-md transition dark:border-ink-800 dark:bg-ink-900/80">
                    <div>
                      <p class="font-semibold text-ink-900 dark:text-white">Sea Salt Caramel Tart</p>
                      <p class="text-sm text-ink-500 dark:text-ink-400">Kakao vendore, krem chantilly me agrume, krokant bajameje</p>
                    </div>
                    <p class="text-sm font-semibold text-brand-600 dark:text-brand-300">€9</p>
                  </div>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-900/5 px-4 py-3 dark:bg-ink-900/40">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-bolt" class="h-5 w-5 text-brand-600 dark:text-brand-300" />
                    <p class="text-sm font-medium text-ink-600 dark:text-ink-300">Motori i shitjeve shtesë sugjeron shtimin e një kombinimi ëmbëlsire</p>
                  </div>
                  <UButton size="xs" variant="soft" label="Shto rekomandimin" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="bg-white/90 dark:bg-ink-950/60">
        <div class="mx-auto max-w-7xl px-6 py-24">
          <div class="mx-auto max-w-3xl text-center">
            <h2 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">Një paketë moderne për ekipet e mikpritjes</h2>
            <p class="mt-4 text-lg text-ink-600 dark:text-ink-300">Ndërthurni rrëfimin e markës me efikasitetin operativ. MenuPika mban ekipet në sinkron dhe mysafirët të entuziazmuar.</p>
          </div>
          <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <UCard class="h-full border border-ink-100/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-4">
                <span class="h-12 w-12 rounded-2xl bg-brand-500/15 text-brand-600 flex items-center justify-center">
                  <UIcon name="i-heroicons-cog-8-tooth" class="h-6 w-6" />
                </span>
                <h3 class="text-xl font-semibold text-ink-900 dark:text-white">Sistem dizajni i gatshëm</h3>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">Përshtatni paraqitjet me tokens, tipografi dhe animacione të harmonizuara me standardet globale të dizajnit.</p>
              </div>
            </UCard>
            <UCard class="h-full border border-ink-100/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-4">
                <span class="h-12 w-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                  <UIcon name="i-heroicons-signal" class="h-6 w-6" />
                </span>
                <h3 class="text-xl font-semibold text-ink-900 dark:text-white">Analiza të performancës live</h3>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">Matni kohën e qëndrimit dhe konvertimet e pjatave në kohë reale për të amplifikuar artikujt me rezultat më të lartë.</p>
              </div>
            </UCard>
            <UCard class="h-full border border-ink-100/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-4">
                <span class="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <UIcon name="i-heroicons-globe-alt" class="h-6 w-6" />
                </span>
                <h3 class="text-xl font-semibold text-ink-900 dark:text-white">Publikim i gatshëm globalisht</h3>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">Lokalizoni përmbajtjen, menaxhoni menu sezonale dhe publikoni menjëherë në çdo pikë shërbimi.</p>
              </div>
            </UCard>
            <UCard class="h-full border border-ink-100/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-4">
                <span class="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <UIcon name="i-heroicons-device-phone-mobile" class="h-6 w-6" />
                </span>
                <h3 class="text-xl font-semibold text-ink-900 dark:text-white">Përvoja mobile në qendër</h3>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">E optimizuar për skanim të shpejtë, imazhe dinamike dhe mysafirë shumëgjuhësh në çdo pajisje.</p>
              </div>
            </UCard>
            <UCard class="h-full border border-ink-100/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-4">
                <span class="h-12 w-12 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <UIcon name="i-heroicons-command-line" class="h-6 w-6" />
                </span>
                <h3 class="text-xl font-semibold text-ink-900 dark:text-white">Arkitekturë e përbërshme</h3>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">Blloqet bazë dhe modelet e strukturuara e bëjnë të lehtë shkallëzimin nga kafetë boutique te grupet e mëdha të mikpritjes.</p>
              </div>
            </UCard>
            <UCard class="h-full border border-ink-100/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-4">
                <span class="h-12 w-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                  <UIcon name="i-heroicons-user-group" class="h-6 w-6" />
                </span>
                <h3 class="text-xl font-semibold text-ink-900 dark:text-white">Flukse pune gati për ekipet</h3>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">Caktoni role, aprovoni ndryshime dhe sinkronizoni asetet e markës përmes një rrjedhe të udhëzuar.</p>
              </div>
            </UCard>
          </div>
        </div>
      </section>

      <section id="templates" class="bg-gradient-to-b from-white to-ink-50/60 dark:from-ink-950 dark:to-ink-900">
        <div class="mx-auto max-w-7xl px-6 py-24">
          <div class="flex flex-col items-start justify-between gap-10 lg:flex-row">
            <div class="max-w-lg space-y-6">
              <h2 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">Koleksione shabllonesh të krijuara nga dizajnerë mikpritjeje</h2>
              <p class="text-lg text-ink-600 dark:text-ink-300">Zgjidhni midis glassmorphism të shtresuar, neo-brutalizmit, botanik dhe paletave luksoze. Çdo shabllon është i aksesueshëm, responsive dhe i optimizuar për konvertime.</p>
              <div class="flex flex-wrap gap-3 text-sm text-ink-600 dark:text-ink-300">
                <span class="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-ink-100 dark:bg-ink-900 dark:ring-ink-800">Aurora Luxe</span>
                <span class="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-ink-100 dark:bg-ink-900 dark:ring-ink-800">Modern Bento</span>
                <span class="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-ink-100 dark:bg-ink-900 dark:ring-ink-800">Nordic Slate</span>
                <span class="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-ink-100 dark:bg-ink-900 dark:ring-ink-800">Holographic Wave</span>
              </div>
            </div>
            <div class="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
              <div class="rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-lg shadow-ink-500/10 dark:border-ink-800 dark:bg-ink-900/70">
                <p class="text-sm font-semibold text-brand-600 dark:text-brand-300">Dark premium</p>
                <p class="mt-3 text-lg font-semibold text-ink-900 dark:text-white">Aurora Luxe</p>
                <p class="mt-2 text-sm text-ink-500 dark:text-ink-400">Gradient xhami, hierarki të ndritshme, perfekt për lounge koktejsh.</p>
              </div>
              <div class="rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-lg shadow-ink-500/10 dark:border-ink-800 dark:bg-ink-900/70">
                <p class="text-sm font-semibold text-secondary">Paraqitje bento</p>
                <p class="mt-3 text-lg font-semibold text-ink-900 dark:text-white">Modern Bento</p>
                <p class="mt-2 text-sm text-ink-500 dark:text-ink-400">Rrjet me karta i dizajnuar për menu degustimi dhe ambiente casual.</p>
              </div>
              <div class="rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-lg shadow-ink-500/10 dark:border-ink-800 dark:bg-ink-900/70">
                <p class="text-sm font-semibold text-emerald-500">Qetësi organike</p>
                <p class="mt-3 text-lg font-semibold text-ink-900 dark:text-white">Botanical Garden</p>
                <p class="mt-2 text-sm text-ink-500 dark:text-ink-400">Motivë gjetheje dhe gradientë të butë për histori nga ferma në tryezë.</p>
              </div>
              <div class="rounded-3xl border border-ink-100 bg-white/90 p-6 shadow-lg shadow-ink-500/10 dark:border-ink-800 dark:bg-ink-900/70">
                <p class="text-sm font-semibold text-purple-500">Neo-futurizëm</p>
                <p class="mt-3 text-lg font-semibold text-ink-900 dark:text-white">Holographic Wave</p>
                <p class="mt-2 text-sm text-ink-500 dark:text-ink-400">Ndriçim zhytës, gradientë holografikë, tipografi kinematike.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="analytics" class="bg-white dark:bg-ink-950">
        <div class="mx-auto max-w-7xl px-6 py-24">
          <div class="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div class="space-y-6">
              <h2 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">Rrëfim i mbështetur në të dhëna pa zhurmë të panevojshme</h2>
              <p class="text-lg text-ink-600 dark:text-ink-300">Monitoroni sjelljen e klientëve në të gjitha lokacionet, testoni variacione të reja menusë dhe nxirrni në pah njohuri përmes paneleve të veprueshëm për ekipet kulinare.</p>
              <div class="grid gap-6 sm:grid-cols-2">
                <div class="rounded-2xl border border-ink-100 bg-ink-50/80 p-5 dark:border-ink-800 dark:bg-ink-900/70">
                  <p class="text-2xl font-semibold text-brand-600 dark:text-brand-300">+32%</p>
                  <p class="mt-2 text-sm text-ink-600 dark:text-ink-400">Rritje mesatare e pjatave të theksuara pas aplikimit të sugjerimeve upsell.</p>
                </div>
                <div class="rounded-2xl border border-ink-100 bg-ink-50/80 p-5 dark:border-ink-800 dark:bg-ink-900/70">
                  <p class="text-2xl font-semibold text-secondary">92%</p>
                  <p class="mt-2 text-sm text-ink-600 dark:text-ink-400">Vlerësim kënaqësie për flukset digjitale të porositjes të përforcuara me MenuPika.</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-3">
                <UButton size="md" color="primary" label="Eksploroni paketën e analizave" icon="i-heroicons-chart-bar" />
                <UButton size="md" variant="outline" label="Shkarkoni broshurën" icon="i-heroicons-arrow-down-on-square" />
              </div>
            </div>
            <div class="relative">
              <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/20 via-transparent to-secondary/30 blur-3xl" />
              <div class="relative grid gap-4 rounded-3xl border border-ink-100 bg-white/95 p-6 shadow-xl shadow-ink-500/10 dark:border-ink-800 dark:bg-ink-950/70">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-semibold text-ink-500 dark:text-ink-300">Paneli live</p>
                  <span class="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">Përditësuar 2 min më parë</span>
                </div>
                <div class="rounded-2xl border border-ink-100 bg-gradient-to-br from-brand-500/10 via-white to-secondary/20 p-6 dark:border-ink-800/60 dark:bg-ink-900/70">
                  <p class="text-sm font-medium text-ink-600 dark:text-ink-300">Kategoritë me performancën më të lartë</p>
                  <div class="mt-4 space-y-4">
                    <div>
                      <div class="flex justify-between text-sm font-semibold text-ink-900 dark:text-white">
                        <p>Chef Specials</p>
                        <p>68%</p>
                      </div>
                      <div class="mt-2 h-2 rounded-full bg-ink-100 dark:bg-ink-800">
                        <div class="h-2 rounded-full bg-brand-500" style="width:68%" />
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-sm font-semibold text-ink-900 dark:text-white">
                        <p>Signature Cocktails</p>
                        <p>54%</p>
                      </div>
                      <div class="mt-2 h-2 rounded-full bg-ink-100 dark:bg-ink-800">
                        <div class="h-2 rounded-full bg-secondary" style="width:54%" />
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-sm font-semibold text-ink-900 dark:text-white">
                        <p>Elevated Comfort</p>
                        <p>42%</p>
                      </div>
                      <div class="mt-2 h-2 rounded-full bg-ink-100 dark:bg-ink-800">
                        <div class="h-2 rounded-full bg-emerald-500" style="width:42%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rounded-2xl border border-ink-100 bg-white/90 p-4 dark:border-ink-800/70 dark:bg-ink-900/80">
                  <div class="flex items-center justify-between text-sm text-ink-500 dark:text-ink-400">
                    <p>Rekomandime inteligjente</p>
                    <span class="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live · 12 tavolina</span>
                  </div>
                  <div class="mt-4 space-y-3">
                    <div class="flex items-center justify-between rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-600 shadow-sm dark:border-ink-800 dark:bg-ink-950">
                      <p>Promovoni flat white në kafe me origjinë të vetme</p>
                      <p class="text-emerald-600 dark:text-emerald-400">+18%</p>
                    </div>
                    <div class="flex items-center justify-between rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-600 shadow-sm dark:border-ink-800 dark:bg-ink-950">
                      <p>Shtoni kombinim ëmbëlsire në menunë degustim</p>
                      <p class="text-emerald-600 dark:text-emerald-400">+26%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" class="bg-gradient-to-b from-ink-50 via-white to-ink-50 dark:from-ink-900 dark:via-ink-950 dark:to-ink-900">
        <div class="mx-auto max-w-7xl px-6 py-24">
          <div class="mx-auto max-w-3xl text-center">
            <h2 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">E dashur nga shefat, somelierët dhe operatorët</h2>
            <p class="mt-4 text-lg text-ink-600 dark:text-ink-300">MenuPika u jep ekipeve të mikpritjes aftësinë të ofrojnë përvoja premium pa sakrifikuar shkathtësinë.</p>
          </div>
          <div class="mt-16 grid gap-8 lg:grid-cols-3">
            <UCard class="border border-ink-100/80 bg-white/90 shadow-lg shadow-ink-500/10 dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-6">
                <div class="flex items-center gap-4">
                  <span class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
                    <UIcon name="i-heroicons-user-circle" class="h-7 w-7" />
                  </span>
                  <div>
                    <p class="font-semibold text-ink-900 dark:text-white">Chef Elena Miranda</p>
                    <p class="text-sm text-ink-500 dark:text-ink-400">Culinary Director · Aurora Group</p>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">“Publikojmë përditësime sezonale të menysë për më pak se pesëmbëdhjetë minuta. Mjetet vizuale të merchandising na kanë ndihmuar të rrisim shitjen e pjatave premium me 38%.”</p>
              </div>
            </UCard>
            <UCard class="border border-ink-100/80 bg-white/90 shadow-lg shadow-ink-500/10 dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-6">
                <div class="flex items-center gap-4">
                  <span class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                    <UIcon name="i-heroicons-user-group" class="h-7 w-7" />
                  </span>
                  <div>
                    <p class="font-semibold text-ink-900 dark:text-white">Arben Krasniqi</p>
                    <p class="text-sm text-ink-500 dark:text-ink-400">GM · Skyline Lounge</p>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">“MenuPika ua lejon kamarierëve tanë të fokusohen në rrëfim ndërsa platforma personalizon ofertat. Mysafirët e adhurojnë ndjesinë premium dhe reagimin e menjëhershëm.”</p>
              </div>
            </UCard>
            <UCard class="border border-ink-100/80 bg-white/90 shadow-lg shadow-ink-500/10 dark:border-ink-800/70 dark:bg-ink-900/80">
              <div class="flex flex-col gap-6">
                <div class="flex items-center gap-4">
                  <span class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <UIcon name="i-heroicons-currency-euro" class="h-7 w-7" />
                  </span>
                  <div>
                    <p class="font-semibold text-ink-900 dark:text-white">Maya Patel</p>
                    <p class="text-sm text-ink-500 dark:text-ink-400">Revenue Manager · Vista Collective</p>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-ink-600 dark:text-ink-300">“Paketa e analizave zbuloi artikuj të suksesshëm të papritur dhe udhëzoi një strategji çmimi që dha rezultat brenda javësh. MenuPika tani është në qendër të rritjes sonë.”</p>
              </div>
            </UCard>
          </div>
        </div>
      </section>

      <section id="pricing" class="bg-white dark:bg-ink-950">
        <div class="mx-auto max-w-7xl px-6 py-24">
          <div class="flex flex-col items-center text-center">
            <h2 class="text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">Plane fleksibël për çdo koncept</h2>
            <p class="mt-4 max-w-2xl text-lg text-ink-600 dark:text-ink-300">Filloni me bazat dhe kaloni në qeverisje, analiza dhe shabllone premium të nivelit enterprise ndërsa rriteni.</p>
          </div>
          <div class="mt-16 flex justify-center">
            <UCard class="w-full max-w-3xl border-2 border-brand-500 bg-gradient-to-br from-brand-500/10 via-white to-secondary/10 p-10 shadow-2xl shadow-brand-500/20 dark:border-brand-400 dark:from-brand-900/40 dark:via-ink-950 dark:to-secondary/10">
              <div class="flex flex-col items-center text-center">
                <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white">
                  Plan gjithëpërfshirës
                </div>
                <p class="text-sm font-semibold uppercase tracking-[0.48em] text-brand-700 dark:text-brand-200">MenuPika Studio</p>
                <p class="mt-5 text-5xl font-bold text-ink-900 dark:text-white">€34.99<span class="ml-2 text-base font-medium text-ink-500 dark:text-ink-300">në muaj</span></p>
                <p class="mt-3 max-w-xl text-sm text-ink-600 dark:text-ink-300">Një paketë e thjeshtë me mjete premium, 50 dizajne të punuara me dorë dhe flukse publikimi të drejtuara nga të dhënat që shkallëzohen në çdo tryezë.</p>
              </div>
              <ul class="mt-8 grid gap-4 text-sm text-ink-600 dark:text-ink-300 sm:grid-cols-2">
                <li class="flex items-start gap-3">
                  <UIcon name="i-heroicons-check-circle" class="mt-0.5 h-5 w-5 text-brand-500" />
                  <span><strong class="font-semibold text-ink-900 dark:text-white">50 dizajne premium menusë</strong> me përditësime sezonale dhe variante të sigurta për markën.</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-heroicons-check-circle" class="mt-0.5 h-5 w-5 text-brand-500" />
                  <span>Menu, kategori dhe përkthime të lokalizuara të pakufizuara.</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-heroicons-check-circle" class="mt-0.5 h-5 w-5 text-brand-500" />
                  <span>Analiza në kohë reale, inteligjencë upsell dhe përvoja QR.</span>
                </li>
                <li class="flex items-start gap-3">
                  <UIcon name="i-heroicons-check-circle" class="mt-0.5 h-5 w-5 text-brand-500" />
                  <span>Mbështetje e dedikuar në chat dhe sesione onboarding të udhëzuara.</span>
                </li>
              </ul>
              <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <UButton to="/auth/login" size="lg" color="primary" icon="i-heroicons-arrow-right-circle" label="Aktivizo MenuPika Studio" class="w-full sm:w-auto" />
                <UButton to="/demo" size="lg" variant="soft" icon="i-heroicons-eye" label="Shiko dizajnet e përfshira" class="w-full sm:w-auto" />
              </div>
            </UCard>
          </div>
        </div>
      </section>

      <section id="cta" class="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-secondary text-white">
        <div class="absolute inset-0 opacity-30">
          <div class="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
          <div class="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
        </div>
        <div class="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-24 text-center">
          <span class="rounded-full border border-white/40 px-4 py-1 text-xs font-medium uppercase tracking-[0.4em] text-white/80">Gati për pak minuta</span>
          <h2 class="max-w-3xl text-3xl font-bold sm:text-4xl">Lëshoni një përvojë menuje digjitale premium që ndihet unike për ju</h2>
          <p class="max-w-2xl text-lg text-white/80">Hyni, zgjidhni një shabllon, përshtatni historinë tuaj dhe publikoni në çdo tryezë. Përditësimet e menysë, përkthimet dhe analizat ndodhin në të njëjtin fluks.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <UButton to="/auth/login" size="lg" color="white" label="Hyni" class="text-brand-600" icon="i-heroicons-arrow-right-circle" />
            <UButton to="/demo" size="lg" variant="ghost" label="Shikoni një menu live" icon="i-heroicons-eye" class="text-white hover:bg-white/10" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  ssr: false
})
</script>
