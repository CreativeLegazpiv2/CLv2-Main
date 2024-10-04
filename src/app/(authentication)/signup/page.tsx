
import { Signup } from "@/app/(authentication)/signup/signup-component/Signup";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import React from "react";

export default function Registration() {
    return (
        <>
            <Signup />
            <Transcribed />
            <Infinite />
            <Subscribe />
        </>
    )
}