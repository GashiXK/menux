import { resolveComponent } from 'vue'
import type { Component } from 'vue'

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

export const resolveTemplateComponent = (key: string): Component | null => {
  const componentName = getTemplateComponentName(key)
  if (!componentName) {
    return null
  }
  return resolveComponent(componentName) as Component
}

export const listAvailableTemplateKeys = () => Object.keys(templateComponentMap)

