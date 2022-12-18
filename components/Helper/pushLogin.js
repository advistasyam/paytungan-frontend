const PushLogin = (user, router) => {
  if (user == null || user == "") {
    router.push("/login")
  }
}

const PushOnboarding = (router, profile_data) => {
  if (profile_data != null && profile_data != "") {
    const profile = JSON.parse(profile_data)
    if (profile?.is_onboarding == true) {
      router.push("/onboarding")
    }
  }
}

export { PushLogin, PushOnboarding }
