import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, MessageSquare, Sparkles, Users } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import demo from "@/src/app/image.png";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <Link href="/" className="mr-auto flex items-center gap-2">
          <MessageSquare className="text-primary" />
          <span>Chat System</span>
        </Link>
        <SignInButton mode="modal">
          <button className="cursor-pointer">Sign in</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="cursor-pointer">Sign up</button>
        </SignUpButton>
      </header>
      <main>
        <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Connect with friends in real-time
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Experience seamless communication with Chat System. Share
              messages, photos, and more in a beautiful, intuitive interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <SignInButton mode="modal">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </SignUpButton>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Modern UI</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Group Chats
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-0.5 bg-primary/30 rounded-2xl blur opacity-30" />
              <div className="relative bg-background p-6 rounded-2xl shadow-xl">
                <Image
                  src={demo}
                  alt="Chat App Interface"
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
