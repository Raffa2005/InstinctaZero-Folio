package com.instinctazero.folio

internal enum class ShellScreen { ANALYSIS, PROFILE, GAMES, REPERTOIRES, PRIVACY }

internal class FolioNavigation {
    var screen = ShellScreen.ANALYSIS
        private set
    var keypadOpen = false
        private set
    private fun select(value:ShellScreen) { screen=value;keypadOpen=false }
    fun showProfile()=select(ShellScreen.PROFILE)
    fun showGames()=select(ShellScreen.GAMES)
    fun showAnalysis()=select(ShellScreen.ANALYSIS)
    fun showRepertoires()=select(ShellScreen.REPERTOIRES)
    fun showPrivacy()=select(ShellScreen.PRIVACY)
    fun openKeypad() { if(screen==ShellScreen.PROFILE)keypadOpen=true }
    fun closeKeypad() { keypadOpen=false }
}

/** Eight unambiguous characters entered exclusively through the native touch keypad. */
internal class PairingCodeBuffer {
    companion object {
        const val REQUIRED_LENGTH = 8
        const val ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    }

    private val characters = StringBuilder(REQUIRED_LENGTH)

    val value: String get() = characters.toString()
    val complete: Boolean get() = characters.length == REQUIRED_LENGTH
    var busy: Boolean = false
        private set

    fun append(character: Char): Boolean {
        if (busy) return false
        val normalized = character.uppercaseChar()
        if (normalized !in ALPHABET || characters.length >= REQUIRED_LENGTH) return false
        characters.append(normalized)
        return true
    }

    fun erase(): Boolean {
        if (busy) return false
        if (characters.isEmpty()) return false
        characters.deleteCharAt(characters.lastIndex)
        return true
    }

    fun clear(): Boolean {
        if (busy) return false
        characters.setLength(0)
        return true
    }

    fun beginPair(): Boolean {
        if (!complete || busy) return false
        busy = true
        return true
    }

    fun finishPair() {
        busy = false
    }
}
