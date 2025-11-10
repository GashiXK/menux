import { defineAsyncComponent, type Component } from 'vue'

const templateComponentMap: Record<string, string> = {
  'neon-night': 'NeonNight',
  'minimal-elegance': 'MinimalElegance',
  'dark-glass': 'DarkGlass',
  'retro-card': 'RetroCard',
  'photo-hero': 'PhotoHero',
  'grid-menu': 'GridMenu',
  'split-panels': 'SplitPanels',
  'chalk-board': 'ChalkBoard',
  'magazine': 'Magazine',
  'mono-zen': 'MonoZen',
  'elegant-modern': 'ElegantModern',
  'cosmic-dark': 'CosmicDark',
  'glass-morphism': 'GlassMorphism',
  'luxury-gold': 'LuxuryGold',
  'tropical-vibes': 'TropicalVibes',
  'ocean-breeze': 'OceanBreeze',
  'neon-gradient': 'NeonGradient',
  'minimalist-white': 'MinimalistWhite',
  'forest-nature': 'ForestNature',
  'sunset-warm': 'SunsetWarm',
  'aurora-luxe': 'AuroraLuxe',
  'modern-bento': 'ModernBento',
  'pastel-dream': 'PastelDream',
  'ember-noir': 'EmberNoir',
  'botanical-garden': 'BotanicalGarden',
  'nordic-slate': 'NordicSlate',
  'neo-brutalist': 'NeoBrutalist',
  'holographic-wave': 'HolographicWave',
  'velvet-dusk': 'VelvetDusk',
  'celestial-ink': 'CelestialInk',
  'gilded-art-deco': 'GildedArtDeco',
  'savanna-sunset': 'SavannaSunset',
  'coastal-zen': 'CoastalZen'
}

export const getTemplateComponentName = (key: string) => templateComponentMap[key] ?? null
export const listAvailableTemplateKeys = () => Object.keys(templateComponentMap)

const templateLoaderMap: Record<string, () => Promise<Component>> = {
  'neon-night': () => import('~/components/menu-templates/NeonNight.vue'),
  'minimal-elegance': () => import('~/components/menu-templates/MinimalElegance.vue'),
  'dark-glass': () => import('~/components/menu-templates/DarkGlass.vue'),
  'retro-card': () => import('~/components/menu-templates/RetroCard.vue'),
  'photo-hero': () => import('~/components/menu-templates/PhotoHero.vue'),
  'grid-menu': () => import('~/components/menu-templates/GridMenu.vue'),
  'split-panels': () => import('~/components/menu-templates/SplitPanels.vue'),
  'chalk-board': () => import('~/components/menu-templates/ChalkBoard.vue'),
  'magazine': () => import('~/components/menu-templates/Magazine.vue'),
  'mono-zen': () => import('~/components/menu-templates/MonoZen.vue'),
  'elegant-modern': () => import('~/components/menu-templates/ElegantModern.vue'),
  'cosmic-dark': () => import('~/components/menu-templates/CosmicDark.vue'),
  'glass-morphism': () => import('~/components/menu-templates/GlassMorphism.vue'),
  'luxury-gold': () => import('~/components/menu-templates/LuxuryGold.vue'),
  'tropical-vibes': () => import('~/components/menu-templates/TropicalVibes.vue'),
  'ocean-breeze': () => import('~/components/menu-templates/OceanBreeze.vue'),
  'neon-gradient': () => import('~/components/menu-templates/NeonGradient.vue'),
  'minimalist-white': () => import('~/components/menu-templates/MinimalistWhite.vue'),
  'forest-nature': () => import('~/components/menu-templates/ForestNature.vue'),
  'sunset-warm': () => import('~/components/menu-templates/SunsetWarm.vue'),
  'aurora-luxe': () => import('~/components/menu-templates/AuroraLuxe.vue'),
  'modern-bento': () => import('~/components/menu-templates/ModernBento.vue'),
  'pastel-dream': () => import('~/components/menu-templates/PastelDream.vue'),
  'ember-noir': () => import('~/components/menu-templates/EmberNoir.vue'),
  'botanical-garden': () => import('~/components/menu-templates/BotanicalGarden.vue'),
  'nordic-slate': () => import('~/components/menu-templates/NordicSlate.vue'),
  'neo-brutalist': () => import('~/components/menu-templates/NeoBrutalist.vue'),
  'holographic-wave': () => import('~/components/menu-templates/HolographicWave.vue'),
  'velvet-dusk': () => import('~/components/menu-templates/VelvetDusk.vue'),
  'celestial-ink': () => import('~/components/menu-templates/CelestialInk.vue'),
  'gilded-art-deco': () => import('~/components/menu-templates/GildedArtDeco.vue'),
  'savanna-sunset': () => import('~/components/menu-templates/SavannaSunset.vue'),
  'coastal-zen': () => import('~/components/menu-templates/CoastalZen.vue')
}

export const resolveTemplateComponent = (key: string): Component | null => {
  const loader = templateLoaderMap[key]
  if (!loader) {
    return null
  }
  return defineAsyncComponent(loader)
}

